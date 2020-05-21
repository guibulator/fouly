import { Client, Language } from '@googlemaps/google-maps-services-js';
import { Injectable, Logger } from '@nestjs/common';
import { PlaceDetailsResult } from '@skare/fouly/data';
@Injectable()
export class PlaceDetailsService {
  private client: Client;
  private readonly logger = new Logger(PlaceDetailsService.name);
  constructor() {
    this.client = new Client();
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetailsResult> {
    const promise = this.client.placeDetails({
      params: {
        key: 'AIzaSyD_VZWJhyx3bPExTyos-JSsaemjASgGpWw',
        place_id: placeId,
        language: Language.fr,
        fields: [
          'adr_address',
          'business_status',
          'icon',
          'types',
          'website',
          'name',
          'opening_hours'
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
