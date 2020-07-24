import { Injectable, Logger } from '@nestjs/common';
import { StoreCrowdCommand, StoreCrowdResult, StoreType } from '@skare/fouly/data';
import { Contribute } from '../../modules/contribute/contribute.schema';
import { ContributeService } from '../../modules/contribute/contribute.service';
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
    const currentStoreType = this.getStoreType(storeCrowdCmd.placeDetail);

    const result: StoreCrowdResult = {
      asOfTime: storeCrowdCmd.asOfTime,
      storeType: currentStoreType,
      status: 'N/A'
    };

    if (storeCrowdCmd.placeDetail.business_status !== 'OPERATIONAL') {
      return { ...result, status: 'closed' };
    }

    if (!this.isBusinessOpen(storeCrowdCmd.placeDetail.opening_hours, storeCrowdCmd.asOfTime)) {
      return { ...result, status: 'closed' };
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
      return { ...result, status: statusFromFeedback };
    }

    //Get status from similar store type contributions
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
      return { ...result, status: statusFromOtherTypeFeedback };
    }

    // Get status from fouly custom model
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

    return { ...result, status: foulyModelStatus };
  }

  getStoreType(placeDetail: any): StoreType {
    const isTypeOf = (storeTypes: string[], target: string) => {
      const result = storeTypes.find(
        (x: string) => x.toLowerCase().trim() === target.toLowerCase().trim()
      );
      return result !== undefined;
    };

    const types: string[] = placeDetail.types;

    if (isTypeOf(types, 'supermarket') || isTypeOf(types, 'grocery_supermarket')) {
      return 'supermarket';
    } else if (isTypeOf(types, 'pharmacy')) {
      return 'pharmacy';
    } else if (isTypeOf(types, 'home_goods_store') || isTypeOf(types, 'departement_store')) {
      return 'retail';
    } else if (isTypeOf(types, 'restaurant') || isTypeOf(types, 'cafe')) {
      return 'restaurant';
    } else if (isTypeOf(types, 'liquor_store')) {
      return 'liquor_store';
    } else if (isTypeOf(types, 'hardware_store')) {
      return 'hardware_store';
    } else if (isTypeOf(types, 'electronic_store')) {
      return 'electronic_store';
    } else {
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

  //Todo : Remove this function and get information from google address_components.
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

  getDateTimeFromGoogleFormat(asOfTime: Date, dateFromGoogle: any): Date {
    const googleTime = dateFromGoogle.time;
    const googleWeekDay = dateFromGoogle.day;

    const hours = Math.floor(Number(googleTime) / 100);
    const minutes = Number(googleTime) - hours * 100;

    const resultDateTime = new Date(asOfTime);
    const dateDiff = googleWeekDay - resultDateTime.getDay();
    if (dateDiff !== 0) {
      resultDateTime.setDate(resultDateTime.getDate() + dateDiff);
    }
    resultDateTime.setHours(hours, minutes);
    return resultDateTime;
  }

  isBusinessOpen(openningHours: any, asOfTime: Date): boolean {
    if (!openningHours) {
      return true; //Todo : define how to handle no oppenning hours
    }

    if (openningHours.periods.length === 1) {
      const period = openningHours.periods[0];
      if ((period.open.time = '0000' && openningHours.open_now)) {
        //Open 24h/24h
        return true;
      }
    }

    const dayRef = asOfTime.getDay();
    const openScheduleForThatDay = openningHours.periods.find((x: any) => x.open.day === dayRef);
    const openDateTime = this.getDateTimeFromGoogleFormat(asOfTime, openScheduleForThatDay.open);
    const closeDateTime = this.getDateTimeFromGoogleFormat(asOfTime, openScheduleForThatDay.close);

    //For business like bars, manage usecase that working hours that should be use was yesterday...
    const openScheduleForLastDay = openningHours.periods.find(
      (x: any) => x.open.day === dayRef - 1
    );
    const closeLastDateTime = this.getDateTimeFromGoogleFormat(
      asOfTime,
      openScheduleForLastDay.close
    );
    if (asOfTime < closeLastDateTime) {
      //business still open on yesterday openningHours
      return true;
    } else {
      if (asOfTime < openDateTime) {
        return false;
      }

      if (asOfTime > closeDateTime) {
        return false;
      }
    }

    return true;
  }
}
