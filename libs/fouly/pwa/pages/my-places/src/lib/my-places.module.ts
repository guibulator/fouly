import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FoulyUiModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        component: FavoritesComponent
      },
      {
        path: 'contribute',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/contribute').then((module) => module.ContributeModule)
      }
    ])
  ],
  declarations: [FavoritesComponent]
})
export class MyPlacesModule {}
