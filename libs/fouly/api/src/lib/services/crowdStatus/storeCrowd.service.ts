import { Injectable, Logger } from '@nestjs/common';
import { StoreCrowdCommand, StoreCrowdResult, StoreType } from '@skare/fouly/data';
import { Contribute } from '../../orm/contribute/contribute.schema';
import { ContributeService } from '../../orm/contribute/contribute.service';
import { CityDetailService } from '../rapid-api/cityDetail.service';
import { WeatherService } from '../rapid-api/weather.service';
import { QuoteFromFeedbackService } from './quoteFromFeedback.service';

@Injectable()
export class StoreCrowdService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly cityDetailService: CityDetailService,
    private readonly contributeService: ContributeService,
    private readonly quoteFromFeedbackService: QuoteFromFeedbackService,
    private logger: Logger
  ) {}

  //Todo : Persist or cache crowd status for reuse
  //Todo : Define CrowdStatus enum values;
  async getStoreCrowdStatus(storeCrowdCmd: StoreCrowdCommand): Promise<StoreCrowdResult> {
    // if (storeCrowdCmd.placeDetail.business_status !== 'OPERATIONAL') {
    //   return {
    //     localTime: storeCrowdCmd.localTime,
    //     status: 'closed'
    //   };
    // }

    // if (!this.isBusinessOpen(storeCrowdCmd.placeDetail.opening_hours, storeCrowdCmd.localTime)) {
    //   return {
    //     localTime: storeCrowdCmd.localTime,
    //     status: 'closed'
    //   };
    // }

    // Todo : Try get status from cache
    // const cachedStatus = this.tryGetExistingStatus(storeCrowdCmd.placeDetail.id);
    // if (cachedStatus) {
    //   return {
    //     localTime: storeCrowdCmd.localTime,
    //     status: cachedStatus
    //   };
    // }

    const feedback: Contribute[] = await this.contributeService.find({
      placeId: storeCrowdCmd.placeDetail.place_id
    });
    const statusFromFeedback = this.quoteFromFeedbackService.getCrowdStatusFromContribution(
      feedback
    );
    if (statusFromFeedback) {
      return {
        localTime: storeCrowdCmd.localTime,
        status: statusFromFeedback
      };
    }

    const countryName = this.getNodeValue(storeCrowdCmd.placeDetail.adr_address, 'country-name');
    const countryIsoCode = this.getCountryIsoCode(countryName);
    const city = this.getNodeValue(storeCrowdCmd.placeDetail.adr_address, 'locality');

    // Get RawData
    const weatherStatus = await this.weatherService.getWeatherStatus(city, countryIsoCode, 'fr');
    const cityDetail = await this.cityDetailService.getCityDetail(city, countryIsoCode, 'fr');
    if (!cityDetail) {
      this.logger.log(`Cannot find city details of ${city}`);
    }
    if (!weatherStatus) {
      this.logger.log(`Cannot find wheater details of ${city}`);
    }
    // Set Status
    const storeStatus = this.setPlaceStatus(
      storeCrowdCmd.placeDetail,
      weatherStatus,
      cityDetail,
      storeCrowdCmd.localTime
    );

    return {
      localTime: storeCrowdCmd.localTime,
      status: storeStatus
    };
  }

  getCountryIsoCode(name: string): string {
    switch (name) {
      case 'Canada':
        return 'ca';
      case 'France':
        return 'fr';
      default:
        return 'ca';
    }
  }

  getNodeValue(htmlTextSrc: string, targetName: string): string {
    const DOMParser = require('xmldom').DOMParser;
    const parsedResult = new DOMParser().parseFromString(htmlTextSrc, 'text/html');
    const nodes = Array.from(parsedResult.childNodes);

    const targetNode: any = nodes.find((x: any) => {
      if (x.nodeName && x.attributes) {
        if (x.attributes.length > 0) {
          const attrsNodes = Array.from(x.attributes);
          const className = attrsNodes.find((y: any) => y.nodeValue === targetName);
          return className !== undefined;
        }
      }
      return false;
    });

    return targetNode?.textContent;
  }

  isBusinessOpen(openningHours: any, asOfTime: Date): boolean {
    if (!openningHours) {
      return true; //Todo : define how to handle no oppenning hours
    }
    const dayIndex = asOfTime.getDay();
    const openScheduleForThatDay = openningHours.periods[dayIndex];

    const numberAsOfTime = asOfTime.getHours() * 100 + asOfTime.getMinutes();

    const openTime = openScheduleForThatDay.open.time;
    if (numberAsOfTime < Number(openTime)) {
      return false;
    }

    const closeTime = openScheduleForThatDay.close.time;
    if (numberAsOfTime > Number(closeTime)) {
      return false;
    }

    return true;
  }

  getStoreType(placeDetail: any): StoreType {
    const isTypeOf = (types: string[], target: string) => {
      const result = types.find(
        (x: string) => x.toLowerCase().trim() === target.toLowerCase().trim()
      );
      return result !== undefined;
    };

    const types: string[] = placeDetail.types;

    if (isTypeOf(types, 'supermarket')) {
      return StoreType.Supermarket;
    }
    if (isTypeOf(types, 'pharmacy')) {
      return StoreType.Pharmacy;
    }
    if (isTypeOf(types, 'home_goods_store')) {
      return StoreType.Retail;
    }
    if (isTypeOf(types, 'restaurant')) {
      return StoreType.Retail;
    }
  }

  setPlaceStatus(placeDetail: any, weatherData: any, city: any, asOfTime: Date): string {
    const { main, weather } = weatherData;
    const placeType: StoreType = this.getStoreType(placeDetail);

    let result = 'n/a';
    let weatherStatus = 'n/a';

    if (weather && weather.length > 0) {
      if (main.temp > 20 && weather[0].main === 'Clear') {
        weatherStatus = 'clear-hot';
      } else if (weather[0].main === 'Clear') {
        weatherStatus = 'clear-cold';
      } else {
        weatherStatus = 'cloud-cold';
      }
    } else if (main.temp) {
      if (main.temp > 20) {
        weatherStatus = 'hot';
      } else {
        weatherStatus = 'cold';
      }
    }

    if (city && city.population < 300000) {
      result = 'medium';
    } else {
      if (weatherStatus.includes('cold')) {
        result = 'low';
      } else {
        result = 'high';
      }
    }

    if ((placeType as StoreType) === StoreType.Supermarket) {
      const numberAsOfTime = asOfTime.getHours() * 100;

      if (asOfTime.getDay() !== 0 && asOfTime.getDay() < 6) {
        //Week
        if (numberAsOfTime < 1100) {
          result = 'low';
        } else if (numberAsOfTime < 1500) {
          result = 'medium';
        } else if (numberAsOfTime < 1900) {
          result = 'high';
        } else if (numberAsOfTime < 2000) {
          result = 'medium';
        } else if (numberAsOfTime < 2100) {
          result = 'low';
        }
      } else if (asOfTime.getDay() === 6) {
        //Saterday
        if (numberAsOfTime < 1000) {
          result = 'low';
        } else if (numberAsOfTime < 1200) {
          result = 'medium';
        } else if (numberAsOfTime < 1300) {
          result = 'high';
        } else if (numberAsOfTime < 1500) {
          result = 'medium';
        } else if (numberAsOfTime < 1900) {
          result = 'high';
        } else if (numberAsOfTime < 2000) {
          result = 'medium';
        } else if (numberAsOfTime < 2100) {
          result = 'low';
        }
      } else if (asOfTime.getDay() === 0) {
        //Sunday
        if (numberAsOfTime < 1300) {
          result = 'low';
        } else if (numberAsOfTime < 1800) {
          result = 'medium';
        } else if (numberAsOfTime < 2100) {
          result = 'low';
        }
      }
    }

    return result;
  }
}
