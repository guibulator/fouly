import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceComponent } from './conference/conference.component';
import { UserComponent } from './user/user.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ConferenceComponent, UserComponent],
  exports: [ConferenceComponent, UserComponent]
})
export class FoulySharedProvidersModule {}
