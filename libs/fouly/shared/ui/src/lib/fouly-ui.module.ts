import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FoulyAffluenceComponent } from './affluence/affluence.component';
@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [FoulyAffluenceComponent],
  exports: [FoulyAffluenceComponent, CommonModule]
})
export class FoulyUiModule {}
