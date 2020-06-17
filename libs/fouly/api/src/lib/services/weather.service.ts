import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  constructor(private configService: ConfigService) {}

  async getWeatherStatus(city: string, language: string): Promise<any> {
    axios.defaults.headers.get['x-rapidapi-host'] = 'community-open-weather-map.p.rapidapi.com';
    axios.defaults.headers.get['x-rapidapi-key'] =
      '7f7d3ed6bcmsh9b43c52ce7b45acp16875ajsnbea66dcc88bb';
    axios.defaults.headers.get['useQueryString'] = true;

    const queryUrl = 'https://community-open-weather-map.p.rapidapi.com/weather';

    const queryParams = `?q=${city}%2Cca&units=metric&lang=${language}`;
    const apiResult = await axios.get(`${queryUrl}${queryParams}`);
    const weatherData = apiResult.data;

    const { main, weather } = weatherData;
    let weatherStatus = 'N/A';

    if (weather.length > 0) {
      if (main.temp > 20 && weather[0].main === 'Clear') {
        weatherStatus = 'good-hot';
      } else if (weather[0].main === 'Clear') {
        weatherStatus = 'medium-cold';
      } else {
        weatherStatus = 'bad-cold';
      }
    } else if (main.temp) {
      if (main.temp > 20) {
        weatherStatus = 'hot';
      } else {
        weatherStatus = 'cold';
      }
    }

    return { ...weatherData, foulyStatus: weatherStatus };
  }
}
