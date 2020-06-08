import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { StoreComponent } from './store.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FoulyUiModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: StoreComponent },
      {
        path: 'chat',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/channel').then((module) => module.ChannelModule)
      },
      {
        path: 'my-places',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/channel').then((module) => module.ChannelModule)
      }
    ])
  ],
  declarations: [StoreComponent]
})
export class StoreDetailModule {}
