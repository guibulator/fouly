import { Client, Language, PlaceAutocompleteRequest } from '@googlemaps/google-maps-services-js';
import { PlaceAutocompleteType } from '@googlemaps/google-maps-services-js/dist/places/autocomplete';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaceDetailsResult, SearchResult } from '@skare/fouly/data';
@Injectable()
export class PlaceDetailsService {
  private client: Client;
  private apiKeyEnv = 'FOULY-GOOGLEMAPS-API-KEY';
  private readonly logger = new Logger(PlaceDetailsService.name);
  constructor(private configService: ConfigService) {
    this.client = new Client();
  }

  async getPlaceDetails(placeId: string, sessionToken: string): Promise<PlaceDetailsResult> {
    const promise = this.client.placeDetails({
      params: {
        key: this.configService.get<string>(this.apiKeyEnv),
        place_id: placeId,
        sessiontoken: sessionToken,
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
          'utc_offset',
          'geometry',
          'place_id'
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

  async findPlace(options: {
    query: string;
    lat: number;
    lng: number;
    sessionToken: string;
  }): Promise<SearchResult[]> {
    const request: PlaceAutocompleteRequest = {
      params: {
        input: options.query,
        location: { lat: options.lat, lng: options.lng },
        types: PlaceAutocompleteType.establishment,
        radius: 5000, //5km radius
        key: this.configService.get<string>(this.apiKeyEnv),
        sessiontoken: options.sessionToken,
        language: 'fr'
      }
    };
    const result = await this.client.placeAutocomplete(request);
    if (!result.data?.predictions) {
      throw Error(
        `Error while trying to get data from placeAutocomplete. The error is ${result.statusText}`
      );
    }
    return result.data.predictions.map((p) => {
      return {
        address: p.structured_formatting.secondary_text,
        description: p.structured_formatting.main_text,
        placeId: p.place_id,
        sessionToken: options.sessionToken
      };
    });
  }
}
