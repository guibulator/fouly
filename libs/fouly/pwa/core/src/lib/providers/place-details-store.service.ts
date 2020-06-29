import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlaceDetailsResult } from '@skare/fouly/data';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';
import { ConfigService } from '../modules/config/config.service';
@Injectable({ providedIn: 'root' })
export class PlaceDetailsStoreService {
  private readonly googlePhotoUrl = 'https://maps.googleapis.com/maps/api/place/photo?';
  private readonly _placeDetails = new BehaviorSubject<PlaceDetailsResult[]>([]);
  private readonly _loading = new BehaviorSubject<boolean>(false);
  readonly placeDetails$ = this._placeDetails.asObservable();
  readonly loading$ = this._loading.asObservable();
  private readonly _placeApiKey$: Observable<string>;
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this._placeApiKey$ = this.httpClient
      .get<{ key: string }>(`${this.configService.apiUrl}/place-details/placePhoto/`)
      .pipe(
        map((result) => result.key),
        shareReplay(1)
      );
  }

  loadPlaceId(placeId: string, asOfTime: Date, sessionToken?: string) {
    //TODO: handle failure, immutabilty for store, reuse already loaded item...
    this._loading.next(true);
    this.httpClient
      .get<PlaceDetailsResult>(
        `${this.configService.apiUrl}/place-details/info/${placeId}?asOfTime=${asOfTime}&sessionToken=${sessionToken}`
      )
      .pipe(finalize(() => this._loading.next(false)))
      .subscribe((response) => this._placeDetails.next([response]));
  }

  getPhotoUrl(photoReferenceId: string, maxWidth = 800, maxHeight = 800) {
    console.log('getphotourl');
    return this._placeApiKey$.pipe(
      map(
        (key) =>
          `${this.googlePhotoUrl}maxwidth=${maxWidth}&maxheight=${maxHeight}&photoreference=${photoReferenceId}&key=${key}`
      )
    );
  }
}
