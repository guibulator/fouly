import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FavoriteResult } from '@skare/fouly/data';
import { BehaviorSubject, combineLatest, of, zip } from 'rxjs';
import { catchError, flatMap, map, take } from 'rxjs/operators';
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
  private readonly _favorites$ = new BehaviorSubject<FavoriteResult[]>([]);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
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
    combineLatest([this.authService.currentUser$, this.userPrefService.store$])
      .pipe(flatMap(([user, { userId }]) => this.fetch(user?.id ?? userId)))
      .subscribe((favorites) => this._favorites$.next(favorites ?? []));
  }

  private fetch(userId: string) {
    return this.httpClient.get<FavoriteResult[]>(`${this.apiEndPoint}/favorites?userId=${userId}`);
  }

  add(favorite: FavoriteResult) {
    // If no user, user temp user id
    // optimistic save
    return zip(this.authService.currentUser$, this.userPrefService.store$).pipe(
      flatMap(([user, { userId }]) => {
        favorite.userId = user?.id ?? userId;
        return this._favorites$.pipe(
          take(1),
          map((favorites) => this._favorites$.next([...favorites, favorite])),
          flatMap(() =>
            this.httpClient.post<FavoriteResult>(`${this.apiEndPoint}/favorites`, favorite)
          ),
          catchError(() => of(favorite)) // todo juste while we dont have a backend
        );
      })
    );
  }

  remove(placeId: string) {
    // optimistic remove
    return zip(this.authService.currentUser$, this.userPrefService.store$).pipe(
      flatMap(([user, { userId }]) => {
        return this._favorites$.pipe(
          take(1),
          map((favorites) => {
            const idx = favorites.findIndex((f) => f.placeId === placeId);
            if (idx > -1) {
              favorites.splice(idx, 1);
              this._favorites$.next([...favorites]);
            }
            return [...favorites];
          }),
          flatMap((favorites) => {
            this.httpClient.delete<FavoriteResult>(
              `${this.apiEndPoint}/favorites/${placeId}?userId=${user?.id ?? userId}`
            );
            return of(favorites);
          }),
          catchError(() => of(null)) // todo just while we dont have a backend
        );
      })
    );
  }
}
