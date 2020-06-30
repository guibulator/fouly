import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FoulyUiModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: ContactComponent }])
  ],
  declarations: [ContactComponent]
})
export class ContactModule {}
