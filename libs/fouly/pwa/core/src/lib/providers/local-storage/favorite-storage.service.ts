/// <reference types="googlemaps" />
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FavoriteResult } from '@skare/fouly/data';
import { BaseStorage } from './base-storage.service';
@Injectable({ providedIn: 'root' })
export class FavoriteStorageService extends BaseStorage<FavoriteResult> {
  constructor(protected storage: Storage) {
    super(storage, 'fouly_favorites_places', (favorite) => favorite.placeId);
  }
}
