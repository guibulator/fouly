import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteResult } from '@skare/fouly/data';
import {
  FavoriteService,
  FavoriteStoreService,
  UserPreferenceService
} from '@skare/fouly/pwa/core';
import { SocialUser } from 'angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

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
export class FavoritesComponent implements OnInit {
  favorites$: Observable<FavoriteResult[]>;
  favLoading$: Observable<boolean>;
  user$: Observable<SocialUser>;
  favLimited$: Observable<boolean>; //Unauthenticated users can only save 3 favorites
  showFavImage$: Observable<boolean>;
  lastKnownFavs$: Observable<number[]>;
  favRefreshing$ = new BehaviorSubject(false);
  constructor(
    private favoriteStore: FavoriteStoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private favoriteService: FavoriteService,
    private userPrefService: UserPreferenceService
  ) {
    this.favorites$ = this.favoriteStore.store$;
    this.favLoading$ = this.favoriteStore.loading$;
    this.favLimited$ = this.favoriteService.favLimited$;
    this.lastKnownFavs$ = this.userPrefService.store$.pipe(
      map((pref) => Array(pref.numberOfFavorites).fill(0))
    );
  }
  // TODO: Get achalandage quote for each store and add ion-refresher
  ngOnInit(): void {
    this.showFavImage$ = this.userPrefService.store$.pipe(
      map((userPref) => {
        return userPref.numberOfFavorites === 0;
      })
    );
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

  refresh(event) {
    this.favRefreshing$.next(true);
    this.favoriteService
      .refresh()
      .pipe(
        tap(() => event.target.complete()),
        finalize(() => this.favRefreshing$.next(false))
      )
      .subscribe();
  }
}
