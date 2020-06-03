/// <reference types="googlemaps" />
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FavoriteResult } from '@skare/fouly/data';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { finalize, shareReplay, take, tap } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class FavoriteStoreService {
  private readonly _favorites$ = new BehaviorSubject<FavoriteResult[]>([]);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private alreadyInit = false;
  readonly favorites$ = this._favorites$.asObservable();
  readonly loading$ = this._loading$.asObservable();
  constructor(private storage: Storage) {}

  addFavorite(favorite: FavoriteResult) {
    // optimistic save
    this._favorites$.pipe(take(1)).subscribe((favorites) => {
      favorites = [...this._favorites$.getValue(), favorite]; // keep structure immutable
      this._favorites$.next(favorites);
      this.storage.set('fouly_favorites_places', favorites);
    });
  }

  removeFavorite(placeId: string) {
    // optimistic save
    this._favorites$.pipe(take(1)).subscribe((favorites) => {
      favorites = favorites.filter((p) => p.placeId !== placeId);
      this._favorites$.next([...favorites]); // keep structure immutable
      this.storage.set('fouly_favorites_places', favorites);
    });
  }

  init(): Observable<FavoriteResult[]> {
    if (this.alreadyInit) return this.favorites$;
    this._loading$.next(true);
    return from(this.storage.get('fouly_favorites_places')).pipe(
      tap((favorites) => this._favorites$.next([...(favorites ?? [])])),
      shareReplay(1),
      finalize(() => {
        this._loading$.next(false);
        this.alreadyInit = true;
      })
    );
  }
}
