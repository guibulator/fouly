import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'fouly-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  listFavorites: any;
  constructor(private storage: Storage, private router: Router) {}

  async ionViewDidEnter() {
    this.listFavorites = await this.storage.get('fouly_favorites_places');
    if (!this.listFavorites) {
      this.listFavorites = [];
    }
  }

  onSelectPlace(placeId: string) {
    this.router.navigate(['/app/tabs/map/store-detail', placeId]);
  }

  onRemovePlace(placeId: string) {
    const indexItem = this.listFavorites.findIndex((x) => placeId === x.placeId);
    this.listFavorites.splice(indexItem, 1);
    this.storage.set('fouly_favorites_places', this.listFavorites);
  }
}
