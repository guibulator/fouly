//todo: Add script loading of google api before this component is instantiated (needed to work with Google-Map component)
//todo: add map style to match fouly style
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import {
  FavoriteStoreService,
  LocalisationStoreService,
  PlaceDetailsStoreService
} from '@skare/fouly/pwa/core';
import { BehaviorSubject, from, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { lightStyle } from './map-style';
@Component({
  selector: 'fouly-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  loading$ = new BehaviorSubject(false);

  //TODO: have our own icons
  private readonly urlIcon = {
    me: 'https://fr.seaicons.com/wp-content/uploads/2016/03/Map-Marker-Marker-Inside-Pink-icon.png',
    favorite: 'https://cdn3.iconfinder.com/data/icons/location-map/512/pin_marker_star-512.png',
    store:
      'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Pink.png'
  };
  private subscription = new Subscription();
  private placeIdToFocus: string;
  private markerYou: google.maps.Marker;
  @ViewChild(GoogleMap, { static: false }) private map: GoogleMap;
  positionLatLng: google.maps.LatLng;
  mapOptions: google.maps.MapOptions = {
    clickableIcons: true,
    streetViewControl: false,
    disableDefaultUI: true,
    styles: lightStyle
  };
  center: google.maps.LatLng;
  markers: google.maps.Marker[] = [];
  zoom = 15;
  display?: google.maps.LatLngLiteral;

  constructor(
    public platform: Platform,
    private localisationStore: LocalisationStoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private placeDetailsStore: PlaceDetailsStoreService,
    private favoriteStore: FavoriteStoreService
  ) {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        const placeId = router?.getCurrentNavigation()?.extras?.state?.placeId;
        if (!placeId) return;
        const sessionToken = router?.getCurrentNavigation()?.extras?.state?.sessionToken;
        this.placeDetailsStore.loadPlaceId(placeId, new Date(), sessionToken);
      })
    );

    // Every time a place details is loaded, we add a marker and center the map
    this.subscription.add(
      this.placeDetailsStore.store$.subscribe((place) => {
        // For now there is always only one place in the store
        const geometry = place?.geometry;
        if (geometry)
          this.addPlaceMarker(
            place.geometry.location.lat,
            place.geometry.location.lng,
            place.place_id,
            this.urlIcon.store
          );
      })
    );

    this.subscription.add(
      this.favoriteStore.store$.subscribe((favorites) => {
        favorites.forEach((fav) => {
          this.addPlaceMarker(fav.lat, fav.lng, fav.placeId, this.urlIcon.favorite, false);
        });
      })
    );
  }

  ngOnInit(): void {
    this.centerMe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  mapClick(event: google.maps.MouseEvent & { placeId: string }) {
    if (event.stop) event.stop();
    const placeId = event.placeId;
    if (placeId) {
      this.openStoreDetails(placeId);
    }
  }

  private openStoreDetails(placeId: string) {
    this.router.navigate(['store-detail', placeId], { relativeTo: this.activatedRoute });
  }

  onSearchFocus(e) {
    this.loading$.next(true);
    from(
      this.router.navigate(['place-search'], {
        relativeTo: this.activatedRoute,
        state: { lat: this.positionLatLng.lat(), lng: this.positionLatLng.lng() }
      })
    )
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe();
  }

  centerMe() {
    this.localisationStore.getPosition().subscribe((data) => {
      if (!data) return;
      if (this.markerYou) {
        this.markers = this.markers.filter((p) => this.markerYou !== p);
      }

      this.positionLatLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      this.markerYou = new google.maps.Marker({
        position: this.positionLatLng,
        label: '',
        icon: {
          url: this.urlIcon.me,
          size: new google.maps.Size(100, 100),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(45, 45)
        }
      });

      this.center = new google.maps.LatLng(this.positionLatLng.lat(), this.positionLatLng.lng());
      this.markers = [...this.markers, this.markerYou];
      this.zoom = this.map.getZoom() - 2;
      setTimeout(() => (this.zoom = this.zoom + 2), 500);
    });
  }

  private addPlaceMarker(
    lat: number,
    lng: number,
    placeId: string,
    iconUrl: string,
    center = true
  ) {
    this.markers = this.markers.filter(
      (p) => p.getPosition().lat() !== lat && p.getPosition().lng() !== lng
    );
    const markerPlace = new google.maps.Marker({
      position: { lat, lng },
      icon: {
        url: iconUrl,
        size: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 70),
        scaledSize: new google.maps.Size(40, 40)
      },
      title: placeId,
      place: { placeId: placeId, location: { lat, lng } },
      clickable: true
    });
    this.markers.push(markerPlace);
    if (center) {
      this.center = new google.maps.LatLng({ lat, lng });
    }
  }
}
