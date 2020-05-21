import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private placeDetailsStore: PlaceDetailsStoreService, private route: ActivatedRoute) {}
  placeDetails$: Observable<PlaceDetailsResult[]>;
  ngOnInit(): void {
    this.placeDetails$ = this.placeDetailsStore.placeDetails$.pipe(tap((t) => console.log(t)));
    this.placeDetailsStore.loadPlaceId(this.route.snapshot.params['placeId']);
  }
}
