import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoriteResult } from '@skare/fouly/data';
import { FavoriteStoreService } from '@skare/fouly/pwa/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'fouly-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites$: Observable<FavoriteResult[]>;
  constructor(private favoriteStoreService: FavoriteStoreService, private router: Router) {}
  ngOnInit(): void {
    this.favorites$ = this.favoriteStoreService.favorites$;
    this.favoriteStoreService.init().subscribe();
  }

  onSelectPlace(placeId: string) {
    this.router.navigate(['/app/tabs/map/store-detail', placeId]);
  }

  onRemovePlace(placeId: string) {
    this.favoriteStoreService.removeFavorite(placeId);
  }
}
