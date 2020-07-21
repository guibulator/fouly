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
  notGoogleImage = false;
  subscriptions = new Subscription();
  crowdStatusTranslateTag: string;
  crowdColor: string;
  storeType: string;

  constructor(
    private placeDetailsStore: PlaceDetailsStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private favoriteStoreService: FavoriteStoreService,
    private favoriteService: FavoriteService,
    private authService: AuthenticationService
  ) {}

  placeDetails$: Observable<PlaceDetailsResult[]>;
  loading$: Observable<boolean>;

  ngOnInit() {
    this.loading$ = this.placeDetailsStore.loading$;
    this.placeDetails$ = this.placeDetailsStore.placeDetails$;

    this.mainImage$ = this.placeDetails$.pipe(
      filter((details) => details && details.length > 0),
      flatMap((details) => {
        this.setCrowdStatus(details[0].storeCrowdResult.status);
        this.storeType = details[0].storeCrowdResult.storeType;

        if (details[0]?.photos && details[0].photos.length > 0) {
          // TODO: Pick a photo that is in landscape and not portrait. Some of them now are
          // protrait and the ui is ugly...
          return this.placeDetailsStore.getPhotoUrl(details[0]?.photos[0]?.photo_reference);
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

  setCrowdStatus(status: string): any {
    this.crowdStatusTranslateTag = `sharedUI.affluence.${status}`;

    if (status === 'low') {
      this.crowdColor = 'success';
    } else if (status === 'medium') {
      this.crowdColor = 'warning';
    } else if (status === 'high') {
      this.crowdColor = 'danger';
    }
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
        state: { placeId: placeDetails[0].place_id }
      });
    });
  }
  gotoContribute() {
    this.placeDetails$.pipe(take(1)).subscribe((placeDetails) => {
      const storeType = placeDetails[0].storeCrowdResult.storeType;
      this.router.navigate(['contribute', storeType], {
        relativeTo: this.route,
        state: {
          closed: !placeDetails[0].opening_hours?.open_now,
          storeType: placeDetails[0].storeCrowdResult.storeType
        }
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
            return this.favoriteStoreService.remove(placeDetails[0].place_id);
          } else {
            if (favLimited) {
              this.gotoFavorites();
              return of(null);
            }
            return this.favoriteStoreService.add({
              userId: user?.id,
              address: placeDetails[0].shortAddress,
              placeId: placeDetails[0].place_id,
              name: placeDetails[0].name,
              lat: placeDetails[0].geometry.location.lat,
              lng: placeDetails[0].geometry.location.lng
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
