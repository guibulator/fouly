//todo: Add script loading of google api before this component is instantiated (needed to work with Google-Map component)
//todo: add map style to match fouly style
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { lightStyle } from './map-style';
@Component({
  selector: 'fouly-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild(MapInfoWindow, { static: false }) private infoWindow: MapInfoWindow;
  @ViewChild(GoogleMap, { static: false }) private map: GoogleMap;
  private subscription = new Subscription();
  mapOptions: google.maps.MapOptions = {
    clickableIcons: true,
    streetViewControl: false,
    disableDefaultUI: true,
    styles: lightStyle
  };
  center: google.maps.LatLng;
  markerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 15;
  display?: google.maps.LatLngLiteral;
  private firstLoad = true;
  constructor(
    public platform: Platform,
    private geolocation: Geolocation,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  mapClick(event: google.maps.MouseEvent & { placeId: string }) {
    event.stop();
    const placeId = event.placeId;
    if (placeId) {
      this.router.navigate(['store-detail', placeId], { relativeTo: this.route });
    }
  }

  openInfoWindow(marker: MapMarker) {}

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
      const positionLatLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      const markerYou = new google.maps.Marker({
        position: positionLatLng,
        title: 'Position via geolocation'
      });
      this.markerPositions.push(positionLatLng.toJSON());
      this.center = positionLatLng;
      this.firstLoad = false;
    }
  }
}
