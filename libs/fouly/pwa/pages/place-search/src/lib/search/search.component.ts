/// <reference types="googlemaps" />
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FavoriteResult, SearchResult } from '@skare/fouly/data';
import { ConfigService, FavoriteStoreService } from '@skare/fouly/pwa/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, share, switchMap, tap } from 'rxjs/operators';
import { uuid } from 'uuidv4';
@Component({
  selector: 'fouly-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  busy = false;
  private textInput$ = new Subject<CustomEvent>();
  private sessionToken = uuid();
  private latLng: google.maps.LatLngLiteral;
  private subscriptions = new Subscription();

  predictions$: Observable<SearchResult[]>;
  favorites$: Observable<FavoriteResult[]>;

  @ViewChild(IonSearchbar) private searchBar: IonSearchbar;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private httpClient: HttpClient,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private favoriteStore: FavoriteStoreService,
    private translate: TranslateService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.latLng = {
        lat: router?.getCurrentNavigation()?.extras?.state?.lat,
        lng: router?.getCurrentNavigation()?.extras?.state?.lng
      };
    });
    this.favorites$ = this.favoriteStore.store$;
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
    this.router.navigate(['/app/tabs/map/store-detail', placeId], {
      state: { placeId, sessionToken: this.sessionToken }
    });
    // this.router.navigate(['app/tabs/map'], {
    //   state: { placeId, sessionToken: this.sessionToken }
    // });
  }

  ngOnInit(): void {
    const searchText$ = this.textInput$.pipe(
      map((event) => event.detail.value),
      filter((x) => x !== ''),
      distinctUntilChanged(),
      tap(() => (this.busy = true)),
      share()
    );

    this.predictions$ = searchText$.pipe(
      switchMap((search) => this.findPredictions(search)),
      tap(() => (this.busy = false))
    );

    this.subscriptions.add(
      this.translate.store.onLangChange.subscribe((lang) => {
        this.translate.use(lang.lang);
      })
    );

    this.translate.use(this.translate.store.currentLang);
  }

  private findPredictions(value) {
    const apiEndPoint = this.configService.apiUrl;
    return this.httpClient.get<SearchResult[]>(
      `${apiEndPoint}/place-details/find/?query=${value}&lat=${this.latLng.lat}&lng=${this.latLng.lng}&sessionToken=${this.sessionToken}&languageCode=${this.translate.currentLang}}`
    );
  }
}
