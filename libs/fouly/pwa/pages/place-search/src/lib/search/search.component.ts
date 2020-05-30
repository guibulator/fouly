/// <reference types="googlemaps" />
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar, NavController } from '@ionic/angular';
import { SearchResult } from '@skare/fouly/data';
import { ConfigService } from '@skare/fouly/pwa/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { uuid } from 'uuidv4';
@Component({
  selector: 'fouly-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private textInput$ = new Subject<CustomEvent>();
  predictions$: Observable<SearchResult[]>;
  private sessionToken = uuid();
  private latLng: google.maps.LatLngLiteral;
  @ViewChild(IonSearchbar) private searchBar: IonSearchbar;
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private httpClient: HttpClient,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.latLng = {
        lat: router?.getCurrentNavigation()?.extras?.state?.lat,
        lng: router?.getCurrentNavigation()?.extras?.state?.lng
      };
    });
  }

  ionViewDidEnter() {
    this.searchBar.setFocus();
  }

  onChange(event: CustomEvent) {
    this.textInput$.next(event);
  }

  onCancel() {
    this.navCtrl.pop();
  }

  onSelectPlace(placeId: string) {
    this.router.navigate(['app/tabs/map'], {
      state: { placeId, sessionToken: this.sessionToken }
    });
  }

  ngOnInit(): void {
    const searchText$ = this.textInput$.pipe(
      map((event) => event.detail.value),
      filter((x) => x !== ''),
      distinctUntilChanged()
    );

    this.predictions$ = searchText$.pipe(switchMap((search) => this.callGoogle(search)));
  }

  private callGoogle(value) {
    const apiEndPoint = this.configService.apiUrl;
    return this.httpClient.get<SearchResult[]>(
      `${apiEndPoint}/place-details/find/?query=${value}&lat=${this.latLng.lat}&lng=${this.latLng.lng}&sessionToken=${this.sessionToken}}`
    );
  }
}
