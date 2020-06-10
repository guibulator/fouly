import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FoulyAffluenceComponent } from './affluence/affluence.component';
import { FoulyContentCenteredComponent } from './content-centered/content-centered.component';
@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [FoulyAffluenceComponent, FoulyContentCenteredComponent],
  exports: [FoulyAffluenceComponent, FoulyContentCenteredComponent, CommonModule]
})
export class FoulyUiModule {}
