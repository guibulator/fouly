import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
@NgModule({
  imports: [IonicStorageModule, HttpClientModule]
})
export class CoreModule {}
