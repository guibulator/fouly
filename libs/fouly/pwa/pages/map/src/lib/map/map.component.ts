import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';

declare var google;

@Component({
  selector: 'fouly-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild('mapCanvas', { static: true }) mapElement: ElementRef;
  map;
  @ViewChild('mapElement', { static: true }) mapElement2;
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public platform: Platform,
    private geolocation: Geolocation
  ) {}

  ngOnInit(): void {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        // console.log(resp.coords.latitude);
        // console.log(resp.coords.longitude);
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });

    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // console.log(data.coords.latitude);
      // console.log(data.coords.longitude);

      const position = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      const mapOptions = {
        zoom: 15,
        center: position
      };

      this.map = new google.maps.Map(this.mapElement2.nativeElement, mapOptions);
      const marker = new google.maps.Marker({
        position: position,
        title: 'Position via geolocation'
      });

      marker.setMap(this.map);
    });
  }
}
