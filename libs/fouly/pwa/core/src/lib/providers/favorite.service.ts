import { Injectable } from '@angular/core';
import { FavoriteResult } from '@skare/fouly/data';
import { BehaviorSubject, combineLatest, forkJoin, Observable, zip } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../modules/auth';
import { FavoriteStoreService } from '../providers/http/favorite-store.service';
@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly UNAUTH_LIMIT = 3;
  /**
   * Emits true when user can no longer save favorites
   */
  favLimited$ = new BehaviorSubject(false);

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

  /**
   * Create a new set of favorites based on authenticated user
   */
  syncFavoritesFromLocalUser() {
    return zip(this.authService.currentUser$, this.favoriteStore.store$.pipe(take(1))).pipe(
      flatMap(([user, favorites]) => {
        const saves: Observable<FavoriteResult>[] = [];
        favorites.forEach((fav) => {
          fav.userId = user.id;
          saves.push(this.favoriteStore.add(fav));
        });
        return forkJoin(saves);
      })
    );
  }
}
