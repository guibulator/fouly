import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { FavoriteResult } from '@skare/fouly/data';
import { SocialUser } from 'angularx-social-login';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, filter, flatMap, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../../modules/auth';
import { ConfigService } from '../../modules/config/config.service';
import { FavoriteStorageService } from '../local-storage/favorite-storage.service';
/**
 *   // TODO: handle error in every http call. I want to come up with a base class
 *   to avoid repeating, optimistic, retry, failure, etc..
 */
@Injectable({ providedIn: 'root' })
export class FavoritesStoreService {
  private readonly apiEndPoint: string;
  private readonly _favorites$ = new BehaviorSubject<FavoriteResult[]>([]);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  store$ = this._favorites$.asObservable();
  loading$ = this._loading$.asObservable();
  constructor(
    protected storage: Storage,
    private httpClient: HttpClient,
    private configService: ConfigService,
    private favoriteLocalStorage: FavoriteStorageService,
    authService: AuthenticationService
  ) {
    this.apiEndPoint = this.configService.apiUrl;
    // automatically fetch favorites when there is a connected user
    authService.currentUser$
      .pipe(
        filter((user) => !!user),
        flatMap((user) => this.fetch(user))
      )
      .subscribe((favorites) => this._favorites$.next(favorites ?? []));
  }

  private fetch(user: SocialUser) {
    return this.httpClient.get<FavoriteResult[]>(`${this.apiEndPoint}/favorites?userId=${user.id}`);
  }

  add(favorite: FavoriteResult) {
    // optimistic save
    return this._favorites$.pipe(
      take(1),
      map((favorites) => this._favorites$.next([...favorites, favorite])),
      flatMap(() =>
        this.httpClient.post<FavoriteResult>(`${this.apiEndPoint}/favorites`, favorite)
      ),
      catchError(() => of(favorite)) // todo juste while we dont have a backend
    );
  }

  remove(placeId: string) {
    // optimistic remove
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
        this.httpClient.delete<FavoriteResult>(`${this.apiEndPoint}/favorites/${placeId}`);
        return of(favorites);
      }),
      catchError(() => of(null)) // todo juste while we dont have a backend
    );
  }
}
