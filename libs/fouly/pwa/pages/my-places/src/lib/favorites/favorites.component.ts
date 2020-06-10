import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private favoriteStoreService: FavoriteStoreService, private router: Router) {}
  ngOnInit(): void {
    this.favorites$ = this.favoriteStoreService.store$;
    this.subscriptions.add(this.favoriteStoreService.getAll().subscribe());
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
}
