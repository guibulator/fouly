import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { PlaceDetailsResult } from '@skare/fouly/data';
import { PlaceDetailsStoreService } from '@skare/fouly/pwa/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'skare-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  constructor(
    private placeDetailsStore: PlaceDetailsStoreService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage
  ) {}
  placeDetails$: Observable<PlaceDetailsResult[]>;
  loading$: Observable<boolean>;
  private listFavorites: any[];
  private currentPlaceFavorite: any;
  isCurrentFavorite: boolean;

  async ngOnInit() {
    this.loading$ = this.placeDetailsStore.loading$;
    this.placeDetails$ = this.placeDetailsStore.placeDetails$.pipe(tap((t) => console.log(t)));
    this.placeDetailsStore.loadPlaceId(this.route.snapshot.params['placeId']);
    this.placeDetails$.subscribe((data: any) => {
      if (data && data.length) {
        this.currentPlaceFavorite = {
          name: data[0].name,
          placeId: data[0].place_id,
          address: data[0].adr_address
        };
        if (!this.listFavorites) {
          this.listFavorites = [];
        }
        this.isCurrentFavorite =
          this.listFavorites.find((x) => x.placeId === this.currentPlaceFavorite.placeId) !==
          undefined;
      }
    });
    this.listFavorites = await this.storage.get('fouly_favorites_places');
  }

  gotoChat(placeName: string) {
    this.router.navigate(['chat', placeName], { relativeTo: this.route });
  }

  async addRemoveToFavorite() {
    if (!this.listFavorites) {
      this.listFavorites = [];
    }

    if (this.isCurrentFavorite) {
      const indexItem = this.listFavorites.findIndex(
        (x) => this.currentPlaceFavorite.placeId === x.placeId
      );
      this.listFavorites.splice(indexItem, 1);
      this.isCurrentFavorite = false;
    } else {
      this.listFavorites.push(this.currentPlaceFavorite);
      this.isCurrentFavorite = true;
    }
    this.storage.set('fouly_favorites_places', this.listFavorites);
  }
}
