import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicModule } from '@ionic/angular';
import { MapComponent } from './map/map.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: MapComponent
      },
      {
        path: 'store-detail',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/store-detail').then((module) => module.StoreDetailModule)
      }
    ]),
    GoogleMapsModule
  ],
  declarations: [MapComponent],
  providers: [Geolocation]
})
export class MapModule {}
