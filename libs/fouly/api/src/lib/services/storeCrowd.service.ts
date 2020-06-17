import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StoreCrowdCommand, StoreCrowdResult } from '@skare/fouly/data';
import { WeatherService } from './weather.service';

@Injectable()
export class StoreCrowdService {
  private readonly logger = new Logger(StoreCrowdService.name);
  constructor(private configService: ConfigService, private weatherService: WeatherService) {}

  async getStoreCrowdStatus(storeCrowdCmd: StoreCrowdCommand): Promise<StoreCrowdResult> {
    const placeDetail = storeCrowdCmd.placeDetail;

    const weatherStatus = await this.weatherService.getWeatherStatus('Toronto', 'fr');

    const result: StoreCrowdResult = {
      localTime: storeCrowdCmd.localTime,
      status: 'N/A',
      weather: weatherStatus
    };

    return result;
  }
}
