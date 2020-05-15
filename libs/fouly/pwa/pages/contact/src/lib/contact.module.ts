import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    // HttpClient,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: ContactComponent }])
  ],
  declarations: [ContactComponent]
})
export class ContactModule {}
