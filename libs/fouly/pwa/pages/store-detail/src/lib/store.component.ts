import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceDetailsResult } from '@skare/fouly/data';
import {
  AuthenticationService,
  FavoriteService,
  FavoriteStoreService,
  PlaceDetailsStoreService
} from '@skare/fouly/pwa/core';
import { Observable, of, Subscription, zip } from 'rxjs';
import { filter, flatMap, map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'fouly-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {
  isCurrentlyFavorite$: Observable<boolean>;
  mainImage$: Observable<string>;
  placeDetails$: Observable<PlaceDetailsResult>;
  notGoogleImage = false;
  subscriptions = new Subscription();
  crowdStatusTranslateTag: string;
  crowdColor: string;
  constructor(
    private placeDetailsStore: PlaceDetailsStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private favoriteStoreService: FavoriteStoreService,
    private favoriteService: FavoriteService,
    private authService: AuthenticationService
  ) {}

  loading$: Observable<boolean>;

  ngOnInit() {
    this.loading$ = this.placeDetailsStore.loading$;
    this.placeDetails$ = this.placeDetailsStore.store$;

    this.mainImage$ = this.placeDetails$.pipe(
      filter((details) => !!details),
      flatMap((details) => {
        this.setCrowdStatus(details.storeCrowdResult.status);

        if (details.photos?.length > 0) {
          // TODO: Pick a photo that is in landscape and not portrait. Some of them now are
          // protrait and the ui is ugly...
          return this.placeDetailsStore.getPhotoUrl(details?.photos[0]?.photo_reference);
        } else {
          this.notGoogleImage = true;
          return of('assets/img/svg/undraw_best_place_r685.svg');
        }
      }),
      tap((url) => console.log(url))
    );

    this.placeDetailsStore.loadPlaceId(
      this.route.snapshot.params['placeId'],
      new Date() //Todo : add support for choosing different time values
    );
    this.isCurrentlyFavorite$ = this.favoriteStoreService.store$.pipe(
      map((f) => !!f.find((fav) => fav.placeId === this.route.snapshot.params['placeId']))
    );
  }

  // todo: while testing, I got a 403 from requesting the image from google, investigate why.
  // In the meantime, user the fouly image if it happens.
  mainImageError() {
    this.notGoogleImage = true;
    this.mainImage$ = of('assets/img/svg/undraw_best_place_r685.svg');
  }

  private setCrowdStatus(status: string): any {
    this.crowdStatusTranslateTag = `sharedUI.affluence.${status}`;
  }

  gotoChat(placeName: string) {
    this.router.navigate(['chat', placeName], { relativeTo: this.route });
  }

  gotoOwner(placeName: string) {
    this.router.navigate(['owner-enroll'], { relativeTo: this.route });
  }

  gotoFavorites() {
    this.router.navigate(['my-places'], { relativeTo: this.route });
  }
  gotoMap() {
    this.placeDetails$.pipe(take(1)).subscribe((placeDetails) => {
      this.router.navigate(['app/tabs/map/'], {
        state: { placeId: placeDetails?.place_id }
      });
    });
  }
  gotoContribute() {
    this.placeDetails$.pipe(take(1)).subscribe((placeDetails) => {
      this.router.navigate(['contribute'], {
        relativeTo: this.route,
        state: { closed: !placeDetails?.opening_hours?.open_now }
      });
    });
  }

  addRemoveToFavorite() {
    zip(
      this.placeDetails$,
      this.isCurrentlyFavorite$,
      this.authService.currentUser$,
      this.favoriteService.favLimited$
    )
      .pipe(
        take(1),
        flatMap(([placeDetails, isCurrentlyFavorite, user, favLimited]) => {
          if (isCurrentlyFavorite) {
            return this.favoriteStoreService.remove(placeDetails.place_id);
          } else {
            if (favLimited) {
              this.gotoFavorites();
              return of(null);
            }
            return this.favoriteStoreService.add({
              userId: user?.id,
              address: placeDetails.shortAddress,
              placeId: placeDetails.place_id,
              name: placeDetails.name,
              lat: placeDetails.geometry.location.lat,
              lng: placeDetails.geometry.location.lng
            });
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
