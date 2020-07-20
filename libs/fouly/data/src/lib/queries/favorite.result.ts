import { StoreCrowdResult } from './store-crowd.result';

export class FavoriteResult {
  placeId: string;
  storeCrowdResult?: StoreCrowdResult;
  userId?: string;
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
}
