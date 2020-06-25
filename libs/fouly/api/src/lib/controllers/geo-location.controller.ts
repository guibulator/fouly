import { Controller, Get, Logger, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeolocationResult } from '@skare/fouly/data';
import axios from 'axios';
@Controller('geo')
export class GeoLocationController {
  private ipStackKey = 'FOULY-IPSTACK-API-KEY'; //1. free -> 10k request/month with http only 2. 10$/Month -> 50k with https
  constructor(private configurationService: ConfigService, private logger: Logger) {}
  @Get()
  async getData(@Request() request): Promise<GeolocationResult> {
    const ip = request.ip;
    this.logger.verbose(`Trying to get geolocation from ip address ${ip} `);
    const result = await axios.get(
      `http://api.ipstack.com/${ip}?access_key=${this.configurationService.get<string>(
        this.ipStackKey
      )}`
    );
    if (!result?.data?.latitude) {
      this.logger.log('Could not get location from ip address, using Montreal as default.');
      // If geolocation failed by ip, we return for lat position of Montreal
      return { lat: 45.4993445, lng: -73.5709779 };
    } else {
      this.logger.log(
        `Got geolocation from ip:${ip} -> lat:${result.data.latitude} lng:${result.data.longitude} `
      );
    }
    return { lat: result.data.latitude, lng: result.data.longitude };
  }
}
