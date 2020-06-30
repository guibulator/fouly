import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { ChannelComponent } from './channel.component';

@NgModule({
  imports: [
    CommonModule,
    FoulyUiModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: ':placeName',
        component: ChannelComponent
      }
    ]),
    TranslateModule
  ],
  declarations: [ChannelComponent]
})
export class ChannelModule {}
