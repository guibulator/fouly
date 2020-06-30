import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [IonicStorageModule, HttpClientModule, TranslateModule],
  providers: [Geolocation]
})
export class CoreModule {}
