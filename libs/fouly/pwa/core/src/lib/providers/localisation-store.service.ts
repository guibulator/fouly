/// <reference types="googlemaps" />

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { GeolocationResult } from '@skare/fouly/data';
import { BehaviorSubject, from, onErrorResumeNext } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../modules/config';
@Injectable({ providedIn: 'root' })
export class LocalisationStoreService {
  private readonly _currentPosition$ = new BehaviorSubject<Geoposition>(null);
  readonly currentPosition$ = this._currentPosition$.asObservable();
  positionLatLng: google.maps.LatLng;
  constructor(
    private geolocation: Geolocation,
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}
  //TODO: handle errors, if can't get from html5 geo, we try a fallback on the server to get from ip
  // if it still not working, we should take a default lat/lng. There are services to get this from multiple properties
  // from device.. The Google geolocation api needs some infos from device and towers to approximate this. For now
  // we use ipstack
  initPosition() {
    return onErrorResumeNext(
      from(
        this.geolocation
          .getCurrentPosition()
          .then((value) => {
            this._currentPosition$.next(value);
          })
          .catch((error) => {
            console.error('Error getting location', error);
            throw error;
          })
      ),
      this.httpClient.get<GeolocationResult>(`${this.configService.apiUrl}/geo`).pipe(
        tap((result) =>
          this._currentPosition$.next({
            coords: {
              latitude: result.lat,
              longitude: result.lng,
              accuracy: 20000,
              altitude: 0,
              altitudeAccuracy: 1000,
              heading: 0,
              speed: 0
            },
            timestamp: Date.now()
          })
        )
      )
    );
  }
}
