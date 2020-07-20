import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteResult } from '@skare/fouly/data';
import {
  AuthenticationService,
  FavoriteService,
  FavoriteStoreService
} from '@skare/fouly/pwa/core';
import { SocialUser } from 'angularx-social-login';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

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
  favLimited$ = new BehaviorSubject(false); //Unauthenticated users can only save 3 favorites
  showFavImage$: Observable<boolean>;

  private readonly subscriptions = new Subscription();
  constructor(
    private favoriteStore: FavoriteStoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private favoriteService: FavoriteService
  ) {
    this.user$ = authService.currentUser$;
    this.favorites$ = this.favoriteStore.store$;
    this.favLimited$ = this.favoriteService.favLimited$;
  }
  // TODO: Get achalandage quote for each store and add ion-refresher
  ngOnInit(): void {
    this.showFavImage$ = combineLatest([this.favoriteStore.store$, this.favLimited$]).pipe(
      map(([favorites, favLimited]) => {
        return favorites.length < 4 && !favLimited;
      })
    );
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
