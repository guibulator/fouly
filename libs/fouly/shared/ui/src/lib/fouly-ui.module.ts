import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyContentCenteredComponent } from './content-centered/content-centered.component';
import { FoulyCrowdIconDirective } from './directives/fouly-crowd-icon.directive';
import { FoulyOpeningHoursModalDirective } from './opening-hours/opening-hours-modal.directive';
import { FoulyOpeningHoursComponent } from './opening-hours/opening-hours.component';

@NgModule({
  imports: [CommonModule, TranslateModule, IonicModule],
  declarations: [
    FoulyContentCenteredComponent,
    FoulyOpeningHoursComponent,
    FoulyOpeningHoursModalDirective,
    FoulyCrowdIconDirective
  ],
  exports: [
    FoulyContentCenteredComponent,
    CommonModule,
    FoulyOpeningHoursModalDirective,
    FoulyCrowdIconDirective
  ]
})
export class FoulyUiModule {}
