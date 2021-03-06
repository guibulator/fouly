import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FavoriteResult } from '@skare/fouly/data';
import { of, ReplaySubject, zip } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  flatMap,
  map,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { AuthenticationService } from '../../modules/auth';
import { ConfigService } from '../../modules/config/config.service';
import { UserPreferenceService } from '../local-storage/user-preference.service';
/**
 *   // TODO: handle error in every http call. I want to come up with a base class
 *   to avoid repeating, optimistic, retry, failure, etc..
 */
@Injectable({ providedIn: 'root' })
export class FavoriteStoreService {
  private readonly apiEndPoint: string;
  private readonly _favorites$ = new ReplaySubject<FavoriteResult[]>(1);
  private readonly _loading$ = new ReplaySubject<boolean>(1);
  store$ = this._favorites$.asObservable();
  loading$ = this._loading$.asObservable();
  constructor(
    private userPrefService: UserPreferenceService,
    private httpClient: HttpClient,
    private configService: ConfigService,
    private authService: AuthenticationService
  ) {
    this.apiEndPoint = this.configService.apiUrl;
    // automatically fetch favorites when there is a connected user
    this.authService.currentUser$
      .pipe(
        distinctUntilChanged(),
        switchMap(() => this.fetch())
      )
      .subscribe();
  }
  clear() {
    this._favorites$.next([]);
  }

  fetch() {
    this._loading$.next(true);
    return this.httpClient.get<FavoriteResult[]>(`${this.apiEndPoint}/favorite`).pipe(
      tap((favs) => this._favorites$.next(favs ?? [])),
      tap((favs) => this.userPrefService.setNumberOfFavorites(favs.length)),
      finalize(() => this._loading$.next(false))
    );
  }

  add(favorite: FavoriteResult) {
    // If no user, use temp user id
    // optimistic save
    this.updateLocalFav({ by: 1 });
    return zip(this.authService.currentUser$, this.userPrefService.store$).pipe(
      take(1),
      flatMap(([user, { userId }]) => {
        favorite.userId = user?.id ?? userId;
        return this._favorites$.pipe(
          take(1),
          map((favorites) => this._favorites$.next([...favorites, favorite])),
          flatMap(() =>
            this.httpClient.post<FavoriteResult>(`${this.apiEndPoint}/favorite`, favorite)
          ),
          catchError(() => of(favorite)) // todo juste while we dont have a backend
        );
      })
    );
  }

  remove(foulyPlaceId: string) {
    this.updateLocalFav({ by: -1 });
    // optimistic remove
    return this._favorites$.pipe(
      take(1),
      map((favorites) => {
        const idx = favorites.findIndex((f) => f.foulyPlaceId === foulyPlaceId);
        if (idx > -1) {
          favorites.splice(idx, 1);
          this._favorites$.next([...favorites]);
        }
        return [...favorites];
      }),
      flatMap(() =>
        this.httpClient.delete<FavoriteResult>(`${this.apiEndPoint}/favorite/${foulyPlaceId}`)
      ),
      catchError(() => of(null))
    );
  }

  /**
   * Sync from login in and out. When logging out, we want to continue to work with user temp id
   */
  sync() {
    return zip(this.authService.currentUser$, this._favorites$, this.userPrefService.store$).pipe(
      take(1),
      flatMap(([user, favs, userPref]) =>
        zip(
          of(user),
          of(favs),
          of(userPref),
          this.httpClient.post(
            `${this.apiEndPoint}/favorite/sync?localUserId=${userPref.userId}`,
            {}
          )
        )
      ),
      tap(([user, favorites, userPref, _]) => {
        favorites.forEach((fav) => (fav.userId = user?.id ?? userPref.userId));
        this._favorites$.next([...favorites]);
      })
    );
  }

  private updateLocalFav(opts: { by: number }) {
    this.userPrefService.store$
      .pipe(
        take(1),
        tap(({ numberOfFavorites }) =>
          this.userPrefService.setNumberOfFavorites(numberOfFavorites + opts.by)
        )
      )
      .subscribe();
  }
}
