//TODO: placeDetails will have extra information about our model
import { Place } from '@googlemaps/google-maps-services-js/dist/common';
export interface PlaceDetailsResult extends Place {
  isGoodTimeToGo?: boolean;
}
