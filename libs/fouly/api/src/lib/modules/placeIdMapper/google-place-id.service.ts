import { Client } from '@googlemaps/google-maps-services-js';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** This service is not exposed outside of this module. Use the PlaceIdMapperService isntead. */
@Injectable()
export class GooglePlaceIdService {
  private client: Client;
  private apiKeyEnv = 'FOULY-GOOGLEMAPS-API-KEY';

  constructor(private configService: ConfigService, private logger: Logger) {
    this.client = new Client();
  }

  /**
   * Returns a placeId from a placeId. Google might do rotation on their placeId
   * and we need to work with the updated version. Calling this method won't infer any cost.
  
   * @param placeId 
   */
  async getFreshPlaceId(placeId: string) {
    const result = await this.client.placeDetails({
      params: {
        key: this.configService.get<string>(this.apiKeyEnv),
        place_id: placeId,
        fields: ['place_id']
      }
    });

    if (result?.data?.status === 'OK') {
      return result.data.result.place_id;
    }
    throw Error(
      `Could not refresh id from ${placeId}. The error is ${result?.data?.error_message}`
    );
  }
}
