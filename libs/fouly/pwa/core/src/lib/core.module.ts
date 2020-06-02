import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage';
@NgModule({
  imports: [IonicStorageModule, HttpClientModule],
  providers: [Geolocation]
})
export class CoreModule {}
