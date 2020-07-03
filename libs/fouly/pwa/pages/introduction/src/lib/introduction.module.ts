import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { IntroductionRoutingModule } from './introduction-routing.module';
import { IntroductionComponentPage } from './introduction/introduction.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    IonicStorageModule,
    IntroductionRoutingModule,
    TranslateModule,
    FoulyUiModule
  ],
  declarations: [IntroductionComponentPage]
})
export class IntroductionModule {}
