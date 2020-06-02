//todo: Add script loading of google api before this component is instantiated (needed to work with Google-Map component)
//todo: add map style to match fouly style
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { PlaceDetailsResult } from '@skare/fouly/data';
import { LocalisationStoreService, PlaceDetailsStoreService } from '@skare/fouly/pwa/core';
import { Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { lightStyle } from './map-style';
@Component({
  selector: 'fouly-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
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
    private placeDetailsStore: PlaceDetailsStoreService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      const placeId = router?.getCurrentNavigation()?.extras?.state?.placeId;
      if (!placeId) return;
      const sessionToken = router?.getCurrentNavigation()?.extras?.state?.sessionToken;
      this.placeDetailsStore.loadPlaceId(placeId, sessionToken);
    });

    // Every time a place details is loaded, we add a marker and center the map
    this.placeDetailsStore.placeDetails$
      .pipe(
        tap((place) => {
          // For now there is always only one place in the store
          const geometry = place.length > 0 && place[0].geometry;
          if (geometry) this.addPlaceMarker(place[0]);
        })
      )
      .subscribe();
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

  ngOnInit(): void {}
  ngAfterViewInit() {
    this.map.tilesloaded.pipe(take(1)).subscribe(() => {
      console.log('tiles loaded');
    });
    this.localisationStore.initPosition().subscribe(() => {
      console.log('position initialized');
      this.centerMe();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  centerMe() {
    console.log('center me');
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
          url: 'https://cdn.pixabay.com/photo/2020/04/19/06/57/marvel-5062138_960_720.png',
          size: new google.maps.Size(100, 100),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35)
        }
      });

      this.center = this.positionLatLng;
      this.markers.push(this.markerYou);
    });
  }

  private addPlaceMarker(placeDetail: PlaceDetailsResult) {
    const markerPlace = new google.maps.Marker({
      position: placeDetail.geometry.location,
      icon: {
        url:
          'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Pink.png',
        size: new google.maps.Size(100, 100),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40),
        scaledSize: new google.maps.Size(45, 45)
      },
      title: placeDetail.place_id,
      place: { placeId: placeDetail.place_id },
      clickable: true
    });
    this.markers.push(markerPlace);

    this.center = new google.maps.LatLng(placeDetail.geometry.location);
  }
}
