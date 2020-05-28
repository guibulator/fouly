import { Client, Language } from '@googlemaps/google-maps-services-js';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaceDetailsResult } from '@skare/fouly/data';
@Injectable()
export class PlaceDetailsService {
  private client: Client;
  private apiKeyEnv = 'FOULY-GOOGLEMAPS-API-KEY';
  private readonly logger = new Logger(PlaceDetailsService.name);
  constructor(private configService: ConfigService) {
    this.client = new Client();
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetailsResult> {
    const promise = this.client.placeDetails({
      params: {
        key: this.configService.get<string>(this.apiKeyEnv),
        place_id: placeId,
        language: Language.fr,
        fields: [
          'adr_address',
          'business_status',
          'icon',
          'types',
          'website',
          'name',
          'opening_hours' /* 3$/1000 request to get this*/,
          'photo',
          'utc_offset'
        ]
      }
    });
    const details = await promise;
    if (details?.data?.status === 'OK') {
      this.logger.debug(`Succesfully got place-details for placeId ${placeId}`);
      return details.data.result;
    }
    throw Error(
      `Could not get details of ${placeId}. The error is ${details?.data?.error_message}`
    );
  }
}
