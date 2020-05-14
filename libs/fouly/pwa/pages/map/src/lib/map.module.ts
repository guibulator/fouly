import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicModule } from '@ionic/angular';
import { MapComponent } from './map/map.component';
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
