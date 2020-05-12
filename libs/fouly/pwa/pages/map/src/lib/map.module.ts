import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FoulySharedProvidersModule } from '@skare/fouly/shared/providers';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FoulySharedProvidersModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: MapComponent }])
  ],
  declarations: [MapComponent],
  providers: [Geolocation]
})
export class MapModule {}
