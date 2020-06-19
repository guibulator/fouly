/// <reference types="googlemaps" />

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationResult } from '@skare/fouly/data';
import { from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../modules/config';
@Injectable({ providedIn: 'root' })
export class LocalisationStoreService {
  constructor(
    private geolocation: Geolocation,
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  trackPosition() {
    // todo: call getPosition at certain configurable interval
    //this.getPosition().pipe(interval(5000))
    // intervalPipe
  }

  getPosition() {
    return from(
      this.geolocation
        .getCurrentPosition()
        .then((value) => {
          return value;
        })
        .catch((error) => {
          console.error('Error getting location', error);
          throw error;
        })
    ).pipe(
      catchError(() =>
        this.httpClient.get<GeolocationResult>(`${this.configService.apiUrl}/geo`).pipe(
          map((result) => ({
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
          }))
        )
      )
    );
  }
}
