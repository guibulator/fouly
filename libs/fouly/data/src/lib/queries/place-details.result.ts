//TODO: placeDetails will have extra information about our model
import { Place } from '@googlemaps/google-maps-services-js/dist/common';
import { StoreCrowdResult } from './store-crowd.result';
export interface PlaceDetailsResult extends Place {
  shortAddress: string;
  isGoodTimeToGo?: boolean;
  storeCrowdResult: StoreCrowdResult;
  foulyPlaceId: string;
}
