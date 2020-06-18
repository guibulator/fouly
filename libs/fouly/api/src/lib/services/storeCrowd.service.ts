import { Injectable } from '@nestjs/common';
import { StoreCrowdCommand, StoreCrowdResult } from '@skare/fouly/data';
import { CityDetailService } from './cityDetail.service';
import { WeatherService } from './weather.service';

@Injectable()
export class StoreCrowdService {
  constructor(
    private weatherService: WeatherService,
    private cityDetailService: CityDetailService
  ) {}

  //Todo : Persist or cache crowd status for reuse
  //Todo : define status enum;
  async getStoreCrowdStatus(storeCrowdCmd: StoreCrowdCommand): Promise<StoreCrowdResult> {
    //Todo : deconstruct placeDetail to get city and country
    const placeDetail = storeCrowdCmd.placeDetail;

    //Todo : persist user feedback and get data;
    //const feedback = await this.feedbackService.getFeedback(placeDetail.id)
    // if (feedback) {
    //   return {
    //     localTime: storeCrowdCmd.localTime,
    //     status: feedback
    //   };
    // }

    //Todo : Try get status from db or cache
    // const cachedStatus = this.tryGetExistingStatus(placeDetail.id);
    // if (cachedStatus) {
    //   return {
    //     localTime: storeCrowdCmd.localTime,
    //     status: cachedStatus
    //   };
    // }

    // Get RawData
    const weatherStatus = await this.weatherService.getWeatherStatus('Toronto', 'CA', 'fr');
    const cityDetail = await this.cityDetailService.getCityDetail('Toronto', 'CA', 'fr');

    // Set Status
    const storeStatus = this.setPlaceStatus(placeDetail, weatherStatus, cityDetail);
    return {
      localTime: storeCrowdCmd.localTime,
      status: storeStatus
    };
  }

  //Develop and complexify algorithm
  setPlaceStatus(placeDetail: any, weatherData: any, city: any): string {
    const { main, weather } = weatherData;
    let result = 'n/a';
    let weatherStatus = 'n/a';

    if (weather.length > 0) {
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

    if (city.population < 300000) {
      result = 'medium';
    } else {
      if (weatherStatus.includes('cold')) {
        result = 'low';
      } else {
        result = 'high';
      }
    }

    return result;
  }
}
