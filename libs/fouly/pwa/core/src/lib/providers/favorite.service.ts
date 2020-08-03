import { Injectable } from '@angular/core';
import { combineLatest, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../modules/auth';
import { FavoriteStoreService } from '../providers/http/favorite-store.service';
@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly UNAUTH_LIMIT = 3;
  /**
   * Emits true when user can no longer save favorites
   */
  private _favLimited$ = new ReplaySubject<boolean>(1);
  favLimited$ = this._favLimited$.asObservable();

  constructor(
    private authService: AuthenticationService,
    private favoriteStore: FavoriteStoreService
  ) {
    this._favLimited$.next(false);
    combineLatest([this.authService.currentUser$, this.favoriteStore.store$])
      .pipe(
        map(([user, favorites]) => {
          if (!user) {
            if (favorites.length > this.UNAUTH_LIMIT) this._favLimited$.next(true);
            else this._favLimited$.next(false);
          } else {
            this._favLimited$.next(false);
          }
        })
      )
      .subscribe();
  }

  refresh() {
    return this.favoriteStore.fetch();
  }

  /**
   * Create a new set of favorites based on authenticated user
   */
  syncFavoritesFromLocalUser() {
    return this.favoriteStore.sync();
  }
}
