import { Controller, Get, Ip } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeolocationResult } from '@skare/fouly/data';
import axios from 'axios';
@Controller('geo')
export class GeoLocationController {
  private ipStackKey = 'FOULY-IPSTACK-API-KEY'; //1. free -> 10k request/month with http only 2. 10$/Month -> 50k with https
  constructor(private configurationService: ConfigService) {}
  @Get()
  async getData(@Ip() ip): Promise<GeolocationResult> {
    const result = await axios.get(
      `http://api.ipstack.com/${ip}?access_key=${this.configurationService.get<string>(
        this.ipStackKey
      )}`
    );
    console.log(
      `Getting geolocation from ip:${ip} -> lat:${result.data.latitude} lng:${result.data.longitude} `
    );
    return { lat: result.data.latitude, lng: result.data.longitude };
  }
}
