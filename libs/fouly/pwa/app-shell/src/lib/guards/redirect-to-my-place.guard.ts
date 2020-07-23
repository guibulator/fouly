import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FavoriteResult } from '@skare/fouly/data';
import { FavoriteStoreService, UserPreferenceService } from '@skare/fouly/pwa/core';
import { Observable, of, race } from 'rxjs';
import { filter, map, mapTo } from 'rxjs/operators';
/**
 * If this is the first time a user access the site, don't bother waiting for the favorite to initialize.
 * After 3 favorites, we show the favorite place at first. It contains
 * the store and crowd result which is normally what the user wants to see first.
 */
@Injectable({
  providedIn: 'root'
})
export class RedirectToMyPlaceGuard implements CanActivate {
  private readonly REDIRECT_TO_FAV_PAGE_LIMIT = 3;
  private hasBeenTested = false;
  constructor(
    private router: Router,
    private favoriteStoreService: FavoriteStoreService,
    private userPrefService: UserPreferenceService
  ) {}
  canActivate(_, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (this.hasBeenTested) return of(true);
    const isFirstTimeUser$ = this.userPrefService.store$.pipe(
      filter(({ firstTimeUser }) => firstTimeUser),
      mapTo(true)
    );
    // Whichever completes first will decide the faith of the route
    // if isFirstTimeUser then return true otherwise wait for the favorites
    return race(isFirstTimeUser$, this.favoriteStoreService.store$).pipe(
      map((data) => {
        if (typeof data === 'boolean') {
          this.hasBeenTested = true;
          this.userPrefService.setFirstTimeUser(false);
          return true;
        }
        if ((data as FavoriteResult[]).length > this.REDIRECT_TO_FAV_PAGE_LIMIT) {
          return this.router.parseUrl('/app/tabs/my-places');
        }
        return true;
      })
    );
  }
}
