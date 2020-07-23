import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyContentCenteredComponent } from './content-centered/content-centered.component';
import { FoulyCrowdStatusDirective } from './directives/fouly-crowd-status.directive';
import { FoulyOpeningHoursModalDirective } from './opening-hours/opening-hours-modal.directive';
import { FoulyOpeningHoursComponent } from './opening-hours/opening-hours.component';

@NgModule({
  imports: [CommonModule, TranslateModule, IonicModule],
  declarations: [
    FoulyContentCenteredComponent,
    FoulyOpeningHoursComponent,
    FoulyOpeningHoursModalDirective,
    FoulyCrowdStatusDirective
  ],
  exports: [
    FoulyContentCenteredComponent,
    CommonModule,
    FoulyOpeningHoursModalDirective,
    FoulyCrowdStatusDirective
  ]
})
export class FoulyUiModule {}
