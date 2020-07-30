import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserPreferenceService } from '@skare/fouly/pwa/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
  constructor(private router: Router, private userPrefService: UserPreferenceService) {}
  canActivate(_, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (this.hasBeenTested) return of(true);

    // Whichever completes first will decide the faith of the route
    // if isFirstTimeUser then return true otherwise wait for the favorites
    return this.userPrefService.store$.pipe(
      map(({ firstTimeUser, numberOfFavorites }) => {
        if (firstTimeUser) {
          this.hasBeenTested = true;
          this.userPrefService.setFirstTimeUser(false);
          return true;
        }
        if (numberOfFavorites > this.REDIRECT_TO_FAV_PAGE_LIMIT) {
          return this.router.parseUrl('/app/tabs/my-places');
        }
        return true;
      })
    );
  }
}
