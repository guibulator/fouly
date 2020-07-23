import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PlaceDetailsResult } from '@skare/fouly/data';
import { Observable, ReplaySubject } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';
import { ConfigService } from '../../modules/config/config.service';
@Injectable({ providedIn: 'root' })
export class PlaceDetailsStoreService {
  private readonly googlePhotoUrl = 'https://maps.googleapis.com/maps/api/place/photo?';
  private readonly _placeDetails = new ReplaySubject<PlaceDetailsResult>(1);
  private readonly _loading = new ReplaySubject<boolean>(1);
  readonly store$ = this._placeDetails.asObservable();
  readonly loading$ = this._loading.asObservable();
  private readonly _placeApiKey$: Observable<string>;
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private translateService: TranslateService
  ) {
    this._placeApiKey$ = this.httpClient
      .get<{ key: string }>(`${this.configService.apiUrl}/place-details/key/place-photo/`)
      .pipe(
        map((result) => result.key),
        shareReplay(1)
      );
  }

  loadPlaceId(placeId: string, asOfTime: Date = new Date(), sessionToken?: string) {
    //TODO: handle failure, immutabilty for store, reuse already loaded item...
    this._loading.next(true);
    this.httpClient
      .get<PlaceDetailsResult>(
        `${this.configService.apiUrl}/place-details/place-id/${placeId}?asOfTime=${asOfTime}&sessionToken=${sessionToken}`
      )
      .pipe(finalize(() => this._loading.next(false)))
      .subscribe((response) => this._placeDetails.next(response));
  }

  getPhotoUrl(photoReferenceId: string, maxWidth = 800, maxHeight = 800) {
    return this._placeApiKey$.pipe(
      map(
        (key) =>
          `${this.googlePhotoUrl}maxwidth=${maxWidth}&maxheight=${maxHeight}&photoreference=${photoReferenceId}&key=${key}`
      )
    );
  }
}
