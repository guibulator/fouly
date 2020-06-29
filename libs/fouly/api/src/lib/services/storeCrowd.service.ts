import { Injectable, Logger } from '@nestjs/common';
import { StoreCrowdCommand, StoreCrowdResult, StoreType } from '@skare/fouly/data';
import { Contribute } from '../orm/contribute/contribute.schema';
import { ContributeService } from '../orm/contribute/contribute.service';
import { CityDetailService } from './rapid-api/cityDetail.service';
import { WeatherService } from './rapid-api/weather.service';

@Injectable()
export class StoreCrowdService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly cityDetailService: CityDetailService,
    private readonly contributeService: ContributeService,
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
    const statusFromFeedback = this.getCrowdStatusFromContribution(feedback);
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

  getRecentFeedback(contributions: Contribute[]): Contribute {
    const lastestCtrb = contributions[0];
    const lastContributionHoursDelay: number =
      (new Date().getTime() - new Date(lastestCtrb.time).getTime()) / (3600 * 1000);

    if (lastContributionHoursDelay > 2) return null;

    return lastestCtrb;
  }

  getSimilarTimeFeedback(contributions: Contribute[], asOfTime: Date): Contribute {
    const similarDaysContribution = contributions.filter((x: Contribute) => {
      return this.isSimilarDay(asOfTime.getDay(), new Date(x.time).getDay());
    });

    const similarHoursContribution = similarDaysContribution.filter((x: Contribute) => {
      return this.isSimilarHours(asOfTime.getHours(), new Date(x.time).getHours());
    });

    // const last4Weeks = similarHoursContribution.
    const lastestCtrb = contributions[0];
    const lastContributionHoursDelay: number =
      (new Date().getTime() - new Date(lastestCtrb.time).getTime()) / (3600 * 1000);

    if (lastContributionHoursDelay > 2) return null;

    return lastestCtrb;
  }

  isSimilarHours(asOfHours: number, ctrbHours: number): boolean {
    return Math.abs(asOfHours - ctrbHours) < 2;
  }

  isSimilarDay(asOfDay: number, ctrbDay: number): boolean {
    if ((asOfDay === 1 || asOfDay === 3) && (ctrbDay === 1 || ctrbDay === 3)) {
      return true;
    }
    if ((asOfDay === 2 || asOfDay === 4) && (ctrbDay === 2 || ctrbDay === 4)) {
      return true;
    }
    if ((asOfDay === 6 || asOfDay === 0) && (ctrbDay === 0 || ctrbDay === 6)) {
      return true;
    }

    return asOfDay === ctrbDay;
  }

  getCrowdStatusFromContribution(contributions: Contribute[]): string {
    if (!contributions && contributions.length <= 0) {
      return null;
    }

    const orderedContribution = contributions.sort(
      (a: Contribute, b: Contribute) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    let ctrb = this.getRecentFeedback(orderedContribution);
    if (!ctrb) {
      ctrb = this.getSimilarTimeFeedback(orderedContribution, new Date());
    }

    const contributionTag = `${ctrb.queueLength}-${ctrb.speed}`;
    switch (contributionTag) {
      case 'lt5-fast':
        return 'low';
      case 'lt5-slow':
        return 'low';
      case 'around10-fast':
        return 'low';
      case 'around10-slow':
        return 'medium';
      case 'around20-fast':
        return 'medium';
      case 'around20-slow':
        return 'high';
      case 'gt30-fast':
        return 'high';
      case 'gt30-slow':
        return 'high';
      default:
        return null;
    }
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
