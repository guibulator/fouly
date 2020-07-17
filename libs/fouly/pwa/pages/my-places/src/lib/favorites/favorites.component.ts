import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteResult } from '@skare/fouly/data';
import { AuthenticationService, FavoritesStoreService } from '@skare/fouly/pwa/core';
import { SocialUser } from 'angularx-social-login';
import { Observable, Subscription } from 'rxjs';

/**
 * A user can store up to 3 favorites without being logged in.
 * If the user tries to add in favorite, we show a button asking to log in to be able to have more
 * Once logged in, we sync the favorites from localstorage to the database. All
 * subsequent favorites retrieval is done from the database instead of localstorage
 */
@Component({
  selector: 'fouly-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites$: Observable<FavoriteResult[]>;
  user$: Observable<SocialUser>;
  private readonly subscriptions = new Subscription();
  constructor(
    private favoriteStore: FavoritesStoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    authService: AuthenticationService
  ) {
    this.user$ = authService.currentUser$;
  }
  // TODO: Get achalandage quote for each store
  ngOnInit(): void {
    // if user is logged in, check if there is favs in localstorage
    // if yes, silently migrate them to database

    // if user is not logged in, get/set favs from localstorage
    //this.favorites$ = this.favoriteStorageService.store$;

    this.favorites$ = this.favoriteStore.store$;
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSelectPlace(placeId: string) {
    this.router.navigate(['/app/tabs/map/store-detail', placeId]);
  }

  onRemovePlace(placeId: string) {
    this.favoriteStore.remove(placeId).subscribe();
  }

  gotoContribute(placeId: string) {
    this.router.navigate(['contribute', placeId], { relativeTo: this.activatedRoute });
  }
}
