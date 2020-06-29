import { Injectable, Logger } from '@nestjs/common';
import { StoreCrowdCommand, StoreCrowdResult, StoreType } from '@skare/fouly/data';
import { Contribute } from '../../orm/contribute/contribute.schema';
import { ContributeService } from '../../orm/contribute/contribute.service';
import { CityDetailService } from '../rapid-api/cityDetail.service';
import { WeatherService } from '../rapid-api/weather.service';
import { FoulyCrowdModelService } from './foulyCrowdModel.service';
import { QuoteFromFeedbackService } from './quoteFromFeedback.service';

@Injectable()
export class StoreCrowdService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly cityDetailService: CityDetailService,
    private readonly contributeService: ContributeService,
    private readonly quoteFromFeedbackService: QuoteFromFeedbackService,
    private readonly foulyCrowdModelService: FoulyCrowdModelService,
    private logger: Logger
  ) {}

  //Todo : Persist or cache crowd status for reuse
  //Todo : Define CrowdStatus enum values;
  async getStoreCrowdStatus(storeCrowdCmd: StoreCrowdCommand): Promise<StoreCrowdResult> {
    if (storeCrowdCmd.placeDetail.business_status !== 'OPERATIONAL') {
      return {
        asOfTime: storeCrowdCmd.asOfTime,
        status: 'closed'
      };
    }

    if (!this.isBusinessOpen(storeCrowdCmd.placeDetail.opening_hours, storeCrowdCmd.asOfTime)) {
      return {
        asOfTime: storeCrowdCmd.asOfTime,
        status: 'closed'
      };
    }

    // Todo : Try get status from cache
    // const cachedStatus = this.tryGetExistingStatus(storeCrowdCmd.placeDetail.id);
    // if (cachedStatus) {
    //   return {
    //     localTime: storeCrowdCmd.localTime,
    //     status: cachedStatus
    //   };
    // }

    //Get status from store contributions
    const listOfFeedback: Contribute[] = await this.contributeService.find({
      placeId: storeCrowdCmd.placeDetail.place_id
    });
    const statusFromFeedback = this.quoteFromFeedbackService.getCrowdStatusFromContribution(
      listOfFeedback,
      storeCrowdCmd.asOfTime
    );
    if (statusFromFeedback) {
      return {
        asOfTime: storeCrowdCmd.asOfTime,
        status: statusFromFeedback
      };
    }

    //Get status from similar store type contributions
    const currentStoreType = this.getStoreType(storeCrowdCmd.placeDetail);
    const statusFromOtherStoreTypeFeedback: Contribute[] = await this.contributeService.findFromType(
      {
        storeType: currentStoreType
      }
    );
    const statusFromOtherTypeFeedback = this.quoteFromFeedbackService.getStatusFromSimilarTimeFeedback(
      statusFromOtherStoreTypeFeedback,
      storeCrowdCmd.asOfTime
    );
    if (statusFromOtherTypeFeedback) {
      return {
        asOfTime: storeCrowdCmd.asOfTime,
        status: statusFromOtherTypeFeedback
      };
    }

    //Get status from fouly custom model
    // const countryName = this.getNodeValue(storeCrowdCmd.placeDetail.adr_address, 'country-name');
    // const countryIsoCode = this.getCountryIsoCode(countryName);
    // const city = this.getNodeValue(storeCrowdCmd.placeDetail.adr_address, 'locality');

    // // Get RawData
    // const weatherStatus = await this.weatherService.getWeatherStatus(city, countryIsoCode, 'fr');
    // const cityDetail = await this.cityDetailService.getCityDetail(city, countryIsoCode, 'fr');
    // if (!cityDetail) {
    //   this.logger.log(`Cannot find city details of ${city}`);
    // }
    // if (!weatherStatus) {
    //   this.logger.log(`Cannot find wheater details of ${city}`);
    // }

    const foulyModelStatus = this.foulyCrowdModelService.getCrowdStatus(
      currentStoreType,
      storeCrowdCmd.asOfTime
    );

    return {
      asOfTime: storeCrowdCmd.asOfTime,
      status: foulyModelStatus
    };
  }

  getStoreType(placeDetail: any): StoreType {
    const isTypeOf = (storeTypes: string[], target: string) => {
      const result = storeTypes.find(
        (x: string) => x.toLowerCase().trim() === target.toLowerCase().trim()
      );
      return result !== undefined;
    };

    const types: string[] = placeDetail.types;

    if (isTypeOf(types, 'supermarket') || isTypeOf(types, 'food')) {
      return 'supermarket';
    } else if (isTypeOf(types, 'pharmacy')) {
      return 'pharmacy';
    } else if (isTypeOf(types, 'home_goods_store')) {
      return 'retail';
    } else if (isTypeOf(types, 'restaurant')) {
      return 'restaurant';
    } else if (isTypeOf(types, 'liquor_store')) {
      return 'liquor_store';
    } else if (isTypeOf(types, 'hardware_store')) {
      return 'hardware_store';
    } else if (isTypeOf(types, 'electronic_store')) {
      return 'electronic_store';
    } else if (isTypeOf(types, 'furniture_store')) {
      return 'furniture_store';
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
}
