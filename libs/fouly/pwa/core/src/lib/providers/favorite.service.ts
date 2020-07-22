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
  favLimited$ = new ReplaySubject<boolean>(1);

  constructor(
    private authService: AuthenticationService,
    private favoriteStore: FavoriteStoreService
  ) {
    combineLatest([this.authService.currentUser$, this.favoriteStore.store$])
      .pipe(
        map(([user, favorites]) => {
          if (!user) {
            if (favorites.length > this.UNAUTH_LIMIT) this.favLimited$.next(true);
            else this.favLimited$.next(false);
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
