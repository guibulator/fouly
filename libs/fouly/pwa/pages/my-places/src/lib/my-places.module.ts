import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { FavoritesComponent } from './favorites/favorites.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FoulyUiModule,
    RouterModule.forChild([
      {
        path: '',
        component: FavoritesComponent
      }
    ])
  ],
  declarations: [FavoritesComponent]
})
export class MyPlacesModule {}
