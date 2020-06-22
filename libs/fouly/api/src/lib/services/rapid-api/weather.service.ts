import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private apiRapidKeyEnvName = 'FOULY-XRAPID-API-KEY';
  constructor(private configService: ConfigService) {}

  async getWeatherStatus(city: string, countryCode: string, language: string): Promise<any> {
    const apiKey = this.configService.get<string>(this.apiRapidKeyEnvName);
    axios.defaults.headers.get['x-rapidapi-key'] = apiKey;
    axios.defaults.headers.get['x-rapidapi-host'] = 'community-open-weather-map.p.rapidapi.com';
    axios.defaults.headers.get['useQueryString'] = true;

    const queryUrl = 'https://community-open-weather-map.p.rapidapi.com/weather';

    const queryParams = `?q=${city}%2C${countryCode}&units=metric&lang=${language}`;
    const apiResult = await axios.get(`${queryUrl}${queryParams}`);
    return apiResult.data;
  }
}
