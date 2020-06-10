/// <reference types="googlemaps" />
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserResult } from '@skare/fouly/data';
import { BaseStorage } from './base-storage.service';
@Injectable({ providedIn: 'root' })
export class UserStoreService extends BaseStorage<UserResult> {
  constructor(protected storage: Storage) {
    super(storage, 'fouly_user_store', (user: UserResult) => user?.id);
  }
}
