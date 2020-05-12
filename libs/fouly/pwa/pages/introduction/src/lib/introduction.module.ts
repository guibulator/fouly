import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroductionComponentPage } from './introduction/introduction.component';
import { IonicModule } from '@ionic/angular';
import { IntroductionRoutingModule } from './introduction-routing.module';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  imports: [CommonModule, IonicModule, IonicStorageModule, IntroductionRoutingModule],
  declarations: [IntroductionComponentPage],
})
export class IntroductionModule {}
