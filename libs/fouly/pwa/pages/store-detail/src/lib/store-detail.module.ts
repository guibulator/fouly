import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StoreComponent } from './store.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: StoreComponent },
      {
        path: 'chat/:placeName',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/my-places').then((module) => module.MyPlacesModule)
      }
    ])
  ],
  declarations: [StoreComponent]
})
export class StoreDetailModule {}
