import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FavoriteStoreService } from '@skare/fouly/pwa/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * After 3 favorites, we show the favorite place at first. It contains
 * the store and crowd result which is normally what the user wants to see first.
 */
@Injectable({
  providedIn: 'root'
})
export class RedirectToMyPlaceGuard implements CanActivate {
  private readonly REDIRECT_TO_FAV_PAGE_LIMIT = 3;
  private hasBeenTested = false;
  constructor(private router: Router, private favoriteStoreService: FavoriteStoreService) {}
  canActivate(_, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    if (this.hasBeenTested) return of(true);
    return this.favoriteStoreService.store$.pipe(
      map((favs) => {
        this.hasBeenTested = true;
        if (favs.length > this.REDIRECT_TO_FAV_PAGE_LIMIT) {
          return this.router.parseUrl('/app/tabs/my-places');
        }
        return true;
      })
    );
  }
}
