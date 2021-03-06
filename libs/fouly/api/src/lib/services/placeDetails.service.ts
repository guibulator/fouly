import { Client, Language, PlaceAutocompleteRequest } from '@googlemaps/google-maps-services-js';
import { PlaceAutocompleteType } from '@googlemaps/google-maps-services-js/dist/places/autocomplete';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlaceDetailsResult, SearchResult } from '@skare/fouly/data';
import { PlaceIdMapperService } from '../modules/placeIdMapper/place-id-mapper.service';
import { StoreCrowdService } from './crowdStatus/storeCrowd.service';
@Injectable()
export class PlaceDetailsService {
  private client: Client;
  private apiKeyEnv = 'FOULY-GOOGLEMAPS-API-KEY';
  private readonly logger = new Logger(PlaceDetailsService.name);
  constructor(
    private configService: ConfigService,
    private storeCrowdService: StoreCrowdService,
    private placeIdMapperService: PlaceIdMapperService
  ) {
    this.client = new Client();
  }

  async getPlaceDetails(
    foulyPlaceId: string,
    sessionToken: string,
    asOfTime: Date,
    languageCode?: string
  ): Promise<PlaceDetailsResult> {
    const placeId = await this.placeIdMapperService.getPlaceId(foulyPlaceId);
    const promise = this.client.placeDetails({
      params: {
        key: this.configService.get<string>(this.apiKeyEnv),
        place_id: placeId.placeId,
        sessiontoken: sessionToken,
        language: languageCode ? Language[languageCode] : Language.fr,
        fields: [
          'address_components',
          'adr_address',
          'business_status',
          'permanently_closed',
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
      const address = details.data.result.adr_address.split(',');
      // only take first 2 parts of address
      const shortAddress = [address[0], address[1]].join(',');

      const placeDetail = { ...details.data.result, ...{ shortAddress: shortAddress } };

      const crowdResult = await this.storeCrowdService.getStoreCrowdStatus({
        placeDetail: placeDetail,
        asOfTime: asOfTime
      });

      return { ...placeDetail, storeCrowdResult: crowdResult, foulyPlaceId };
    }
    throw Error(
      `Could not get details of ${placeId} with foulyPlaceId ${foulyPlaceId}. The error is ${details?.data?.error_message}`
    );
  }

  async findPlace(options: {
    query: string;
    lat: number;
    lng: number;
    sessionToken: string;
    languageCode?: string;
  }): Promise<SearchResult[]> {
    const request: PlaceAutocompleteRequest = {
      params: {
        input: options.query,
        location: { lat: options.lat, lng: options.lng },
        types: PlaceAutocompleteType.establishment,
        radius: 5000, //5km radius
        key: this.configService.get<string>(this.apiKeyEnv),
        sessiontoken: options.sessionToken,
        language: options.languageCode ?? 'fr'
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
