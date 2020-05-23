import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlaceDetailsResult } from '@skare/fouly/data';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class PlaceDetailsStoreService {
  private readonly _placeDetails = new BehaviorSubject<PlaceDetailsResult[]>([]);
  private readonly _loading = new BehaviorSubject<boolean>(false);
  readonly placeDetails$ = this._placeDetails.asObservable();
  readonly loading$ = this._loading.asObservable();
  constructor(private httpClient: HttpClient) {}

  get placeDetails(): PlaceDetailsResult[] {
    return this._placeDetails.getValue();
  }

  loadPlaceId(placeId: string) {
    //TODO: handle failure, immutabilty for store, reuse already loaded item...
    this._loading.next(true);
    this.httpClient
      .get<PlaceDetailsResult>(`api/place-details/${placeId}`)
      .pipe(finalize(() => this._loading.next(false)))
      .subscribe((response) => this._placeDetails.next([response]));
  }
}
