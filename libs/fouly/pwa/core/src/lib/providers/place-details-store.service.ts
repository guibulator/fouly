import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlaceDetailsResult } from '@skare/fouly/data';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlaceDetailsStoreService {
  private readonly _placeDetails = new BehaviorSubject<PlaceDetailsResult[]>([]);
  readonly placeDetails$ = this._placeDetails.asObservable();
  constructor(private httpClient: HttpClient) {}

  get placeDetails(): PlaceDetailsResult[] {
    return this._placeDetails.getValue();
  }

  loadPlaceId(placeId: string) {
    //TODO: handle failure, immutabilty for store
    this.httpClient
      .get<PlaceDetailsResult>(`api/place-details/${placeId}`)
      .subscribe((response) => this._placeDetails.next([response]));
  }
}
