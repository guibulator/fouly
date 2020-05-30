import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PlaceSearchLatLngGuard } from './guards/place-search-lat-lng.guard';
import { SearchComponent } from './search/search.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: SearchComponent,
        canActivate: [PlaceSearchLatLngGuard]
      }
    ])
  ],
  declarations: [SearchComponent]
})
export class PlaceSearchModule {}
