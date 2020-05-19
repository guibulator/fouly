import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FoulySharedProvidersModule } from '@skare/fouly/shared/providers';
import { ContactComponent } from './contact/contact.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FoulySharedProvidersModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: ContactComponent }])
  ],
  providers: [FoulySharedProvidersModule],
  declarations: [ContactComponent]
})
export class ContactModule {}
