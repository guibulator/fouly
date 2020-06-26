/// <reference types="googlemaps" />

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationResult } from '@skare/fouly/data';
import { from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../modules/config';
@Injectable({ providedIn: 'root' })
export class LocalisationStoreService {
  constructor(
    private geolocation: Geolocation,
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {}

  getPosition() {
    return from(
      this.geolocation
        .getCurrentPosition()
        .then((value) => {
          return value;
        })
        .catch((error) => {
          console.error('Error getting location from device', error);
          throw error;
        })
    ).pipe(
      catchError(() =>
        this.httpClient
          .get<GeolocationResult>(`${this.configService.apiUrl}/geo`)
          .pipe(map((result) => this.mapToLatLng(result.lat, result.lng)))
      ),
      catchError(() =>
        of({ lat: 45.4993445, lng: -73.5709779 }).pipe(
          // TODO: on last attempt, if first time user, we position in montreal. On second attempt, we should read from last position on map(need to store it)
          map((result) => this.mapToLatLng(result.lat, result.lng))
        )
      )
    );
  }

  private mapToLatLng(lat: number, lng: number) {
    return {
      coords: {
        latitude: lat,
        longitude: lng,
        accuracy: 20000,
        altitude: 0,
        altitudeAccuracy: 1000,
        heading: 0,
        speed: 0
      },
      timestamp: Date.now()
    };
  }
}
