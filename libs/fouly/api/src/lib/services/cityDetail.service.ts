import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class CityDetailService {
  private apiRapidKeyEnvName = 'FOULY-XRAPID-API-KEY';

  constructor(private configService: ConfigService) {}

  async getCityDetail(city: string, countryCode: string, language: string): Promise<any> {
    const apiKey = this.configService.get<string>(this.apiRapidKeyEnvName);
    axios.defaults.headers.get['x-rapidapi-key'] = apiKey;
    axios.defaults.headers.get['x-rapidapi-host'] = 'wft-geo-db.p.rapidapi.com';
    axios.defaults.headers.get['useQueryString'] = true;

    const queryUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
    let queryParams = `?namePrefix=${city}&languageCode=${language}`;

    const getCityResult = await axios.get(`${queryUrl}${queryParams}`);
    const cityResult = getCityResult.data.data.find(
      (x: any) => x.name.includes(city) && x.countryCode === countryCode
    );

    queryParams = `?languageCode=${language}`;

    //Todo : get paid service plan or change Api
    await this.sleep(1500); //Free pricing : one call per second
    const getCityDetailResult = await axios.get(`${queryUrl}/${cityResult.id}${queryParams}`);

    return getCityDetailResult.data.data;
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
