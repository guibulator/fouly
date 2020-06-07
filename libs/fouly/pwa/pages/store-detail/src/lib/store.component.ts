import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceDetailsResult } from '@skare/fouly/data';
import { FavoriteStoreService, PlaceDetailsStoreService } from '@skare/fouly/pwa/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, flatMap, map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'fouly-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  isCurrentlyFavorite$: Observable<boolean>;
  mainImage$: Observable<string>;
  constructor(
    private placeDetailsStore: PlaceDetailsStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private favoriteStoreService: FavoriteStoreService
  ) {
    this.favoriteStoreService.init().subscribe();
  }

  placeDetails$: Observable<PlaceDetailsResult[]>;
  loading$: Observable<boolean>;

  ngOnInit() {
    this.loading$ = this.placeDetailsStore.loading$;
    this.placeDetails$ = this.placeDetailsStore.placeDetails$;

    this.mainImage$ = this.placeDetails$.pipe(
      tap(() => console.log('subscribed')),
      filter((details) => details && details.length > 0),
      flatMap((details) =>
        this.placeDetailsStore.getPhotoUrl(details[0]?.photos[0]?.photo_reference)
      ),
      tap((url) => console.log(url))
    );
    this.placeDetailsStore.loadPlaceId(this.route.snapshot.params['placeId']);
    this.isCurrentlyFavorite$ = this.favoriteStoreService.favorites$.pipe(
      map((f) => !!f.find((fav) => fav.placeId === this.route.snapshot.params['placeId']))
    );
  }

  gotoChat(placeName: string) {
    this.router.navigate(['chat', placeName], { relativeTo: this.route });
  }

  gotoFavorites() {
    this.router.navigate(['my-places'], { relativeTo: this.route });
  }

  addRemoveToFavorite() {
    combineLatest([this.placeDetails$.pipe(take(1)), this.isCurrentlyFavorite$])
      .pipe(take(1))
      .subscribe(([placeDetails, isCurrentlyFavorite]) => {
        if (isCurrentlyFavorite) {
          this.favoriteStoreService.removeFavorite(placeDetails[0].place_id);
        } else {
          return this.favoriteStoreService.addFavorite({
            address: placeDetails[0].adr_address,
            placeId: placeDetails[0].place_id,
            name: placeDetails[0].name,
            lat: placeDetails[0].geometry.location.lat,
            lng: placeDetails[0].geometry.location.lng
          });
        }
      });
  }
}
