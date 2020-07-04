import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from './map/map.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: MapComponent
      },
      {
        path: 'store-detail/:placeId',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/store-detail').then((module) => module.StoreDetailModule)
      },
      {
        path: 'place-search',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/place-search').then((module) => module.PlaceSearchModule),
        data: { preload: true }
      }
    ]),
    GoogleMapsModule
  ],
  declarations: [MapComponent],
  providers: []
})
export class MapModule {}
