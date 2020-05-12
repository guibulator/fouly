import { Component, ElementRef, Inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ConferenceDataService } from '@skare/fouly/shared/providers';

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
    public confData: ConferenceDataService,
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

function getGoogleMaps(apiKey: string): Promise<any> {
  const win = window as any;
  const googleModule = win.google;
  if (googleModule && googleModule.maps) {
    return Promise.resolve(googleModule.maps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${'AIzaSyD_VZWJhyx3bPExTyos-JSsaemjASgGpWw'}&v=3.31`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      const googleModule2 = win.google;
      if (googleModule2 && googleModule2.maps) {
        resolve(googleModule2.maps);
      } else {
        reject('google maps not available');
      }
    };
  });
}
