//todo: Add script loading of google api before this component is instantiated (needed to work with Google-Map component)
//todo: add map style to match fouly style
import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'fouly-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow, { static: false }) private infoWindow: MapInfoWindow;
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

  addMarker(event: google.maps.MouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
  }

  openInfoWindow(marker: MapMarker) {
    this.router.navigate(['store-detail'], { relativeTo: this.route });
  }

  ngOnInit(): void {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        //this.infoWindow.open()
        // console.log(resp.coords.latitude);
        // console.log(resp.coords.longitude);
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });

    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log(data.coords.latitude);
      console.log(data.coords.longitude);
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
    });
  }
}
