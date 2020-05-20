import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StoreComponent } from './store.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: StoreComponent }])
  ],
  declarations: [StoreComponent]
})
export class StoreDetailModule {}
