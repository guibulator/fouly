import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: MapComponent }])
  ],
  declarations: [MapComponent],
  providers: [Geolocation]
})
export class MapModule {}
