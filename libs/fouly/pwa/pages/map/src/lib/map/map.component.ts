//todo: Add script loading of google api before this component is instantiated (needed to work with Google-Map component)
//todo: add map style to match fouly style
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { PlaceDetailsResult } from '@skare/fouly/data';
import { PlaceDetailsStoreService } from '@skare/fouly/pwa/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { lightStyle } from './map-style';
@Component({
  selector: 'fouly-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private firstLoad = true;
  private placeIdToFocus: string;
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
    private geolocation: Geolocation,
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

  onSearchFocus() {
    this.router.navigate(['place-search'], {
      relativeTo: this.activatedRoute,
      state: { lat: this.positionLatLng.lat(), lng: this.positionLatLng.lng() }
    });
  }

  ngOnInit(): void {
    this.geolocation
      .getCurrentPosition()
      .then(this.onPositionChanged.bind(this))
      .catch((error) => {
        console.log('Error getting location', error);
      });

    const watch = this.geolocation.watchPosition();
    this.subscription.add(watch.subscribe(this.onPositionChanged.bind(this)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onPositionChanged(data: Geoposition) {
    if (this.firstLoad) {
      this.positionLatLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      const markerYou = new google.maps.Marker({
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
      this.markers.push(markerYou);
      this.center = this.positionLatLng;
      this.firstLoad = false;
    }
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
    this.zoom = 18;
  }
}
