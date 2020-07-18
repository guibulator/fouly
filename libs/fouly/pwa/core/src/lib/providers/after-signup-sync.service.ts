import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FavoriteService } from './favorite.service';

/**
 * Executes different task after a user signs-up(which is different the simply login with session cookies)
 */
@Injectable({ providedIn: 'root' })
export class AfterSignupSyncService {
  constructor(private favoriteService: FavoriteService) {}

  sync() {
    return forkJoin([
      this.favoriteService.syncFavoritesFromLocalUser() /**Other jobs to put here */
    ]);
  }
}
