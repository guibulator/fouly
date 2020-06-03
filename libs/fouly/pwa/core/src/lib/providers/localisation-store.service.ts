/// <reference types="googlemaps" />

import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { BehaviorSubject, from } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class LocalisationStoreService {
  private readonly _currentPosition$ = new BehaviorSubject<Geoposition>(null);
  private alreadyInit = false;
  readonly currentPosition$ = this._currentPosition$.asObservable();
  positionLatLng: google.maps.LatLng;
  constructor(private geolocation: Geolocation) {}

  initPosition() {
    return from(
      this.geolocation
        .getCurrentPosition()
        .then((value) => {
          this._currentPosition$.next(value);
          this.alreadyInit = true;
        })
        .catch((error) => {
          console.log('Error getting location', error);
        })
    );
  }
}
