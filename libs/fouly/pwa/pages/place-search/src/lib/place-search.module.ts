import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PlaceSearchComponent } from './place-search/place-search.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: PlaceSearchComponent }])
  ],
  declarations: [PlaceSearchComponent]
})
export class PlaceSearchModule {}
