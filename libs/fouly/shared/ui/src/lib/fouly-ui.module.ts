import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FoulyAffluenceComponent } from './affluence/affluence.component';
import { FoulyContentCenteredComponent } from './content-centered/content-centered.component';
import { FoulyOpeningHoursModalDirective } from './opening-hours/opening-hours-modal.directive';
import { FoulyOpeningHoursComponent } from './opening-hours/opening-hours.component';
@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [
    FoulyAffluenceComponent,
    FoulyContentCenteredComponent,
    FoulyOpeningHoursComponent,
    FoulyOpeningHoursModalDirective
  ],
  exports: [
    FoulyAffluenceComponent,
    FoulyContentCenteredComponent,
    CommonModule,
    FoulyOpeningHoursModalDirective
  ]
})
export class FoulyUiModule {}
