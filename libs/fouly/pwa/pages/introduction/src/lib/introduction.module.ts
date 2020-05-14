import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { IntroductionRoutingModule } from './introduction-routing.module';
import { IntroductionComponentPage } from './introduction/introduction.component';

@NgModule({
  imports: [CommonModule, IonicModule, IonicStorageModule, IntroductionRoutingModule],
  declarations: [IntroductionComponentPage]
})
export class IntroductionModule {}
