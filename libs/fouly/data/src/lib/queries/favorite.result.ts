import { StoreCrowdResult } from './store-crowd.result';

export class FavoriteResult {
  foulyPlaceId: string; // our internal placeId that maps to a google placeId
  placeId: string; // google placeId, we expose for convenience.
  storeCrowdResult?: StoreCrowdResult;
  userId?: string;
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
}
