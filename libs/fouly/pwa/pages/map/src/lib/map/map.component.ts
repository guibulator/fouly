//todo: Add script loading of google api before this component is instantiated (needed to work with Google-Map component)
//todo: add map style to match fouly style
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import {
  FavoriteStoreService,
  LocalisationStoreService,
  PlaceDetailsStoreService
} from '@skare/fouly/pwa/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { lightStyle } from './map-style';
@Component({
  selector: 'fouly-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly urlIcon = {
    me:
      'https://toppng.com/uploads/preview/red-location-icon-map-png-clip-art-11563267716immuffqihc.png',
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
    this.activatedRoute.queryParams.subscribe((params) => {
      const placeId = router?.getCurrentNavigation()?.extras?.state?.placeId;
      if (!placeId) return;
      const sessionToken = router?.getCurrentNavigation()?.extras?.state?.sessionToken;
      this.placeDetailsStore.loadPlaceId(placeId, sessionToken);
    });

    // Every time a place details is loaded, we add a marker and center the map
    this.subscription.add(
      this.placeDetailsStore.placeDetails$.subscribe((place) => {
        // For now there is always only one place in the store
        const geometry = place.length > 0 && place[0].geometry;
        if (geometry)
          this.addPlaceMarker(
            place[0].geometry.location.lat,
            place[0].geometry.location.lng,
            place[0].place_id,
            this.urlIcon.store
          );
      })
    );

    this.subscription.add(
      this.favoriteStore.favorites$.subscribe((favorites) => {
        favorites.forEach((fav) => {
          this.addPlaceMarker(fav.lat, fav.lng, fav.placeId, this.urlIcon.favorite);
        });
      })
    );
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
    this.router.navigate(['place-search'], {
      relativeTo: this.activatedRoute,
      state: { lat: this.positionLatLng.lat(), lng: this.positionLatLng.lng() }
    });
  }

  ngOnInit(): void {
    this.localisationStore.initPosition().subscribe(() => {
      console.log('position initialized');
      this.centerMe();
    });
    this.subscription.add(this.favoriteStore.init().subscribe());
  }
  ngAfterViewInit() {
    this.map.tilesloaded.pipe(take(1)).subscribe(() => {
      console.log('tiles loaded');
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  centerMe() {
    this.localisationStore.currentPosition$.pipe(take(1)).subscribe((data) => {
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

      this.center = this.positionLatLng;
      this.markers.push(this.markerYou);
    });
  }

  private addPlaceMarker(lat: number, lng: number, placeId: string, iconUrl: string) {
    this.markers = this.markers.filter(
      (p) => p.getPosition().lat() !== lat && p.getPosition().lng() !== lng
    );
    const markerPlace = new google.maps.Marker({
      position: { lat, lng },
      icon: {
        url: iconUrl,
        size: new google.maps.Size(100, 100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40),
        scaledSize: new google.maps.Size(45, 45)
      },
      title: placeId,
      place: { placeId: placeId, location: { lat, lng } },
      clickable: true
    });
    this.markers.push(markerPlace);

    this.center = new google.maps.LatLng({ lat, lng });
  }
}
