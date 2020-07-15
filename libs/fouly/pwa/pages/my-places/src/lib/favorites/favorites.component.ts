import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteResult } from '@skare/fouly/data';
import { FavoriteStoreService } from '@skare/fouly/pwa/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'fouly-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites$: Observable<FavoriteResult[]>;
  private readonly subscriptions = new Subscription();
  constructor(
    private favoriteStoreService: FavoriteStoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  // TODO: Get achalandage quote for each store
  ngOnInit(): void {
    // if user is logged in, check if there is favs in localstorage
    // if yes, silently migrate them to database

    // if user is not logged in, get/set favs from localstorage
    this.favorites$ = this.favoriteStoreService.store$;
    this.subscriptions.add(
      this.favoriteStoreService.getAll().subscribe((favorites) => {
        // We need to get all the contributions from every place_id
        // It is also possible that the place_id changes so we need to update the cache
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
    this.favoriteStoreService.remove(placeId);
  }

  gotoContribute(placeId: string) {
    this.router.navigate(['contribute', placeId], { relativeTo: this.activatedRoute });
  }
}
