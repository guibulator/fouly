import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { MeasuresComponent } from './measures/measures.component';
import { StoreComponent } from './store.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FoulyUiModule,
    TranslateModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: StoreComponent },
      {
        path: 'chat',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/channel').then((module) => module.ChannelModule)
      },
      {
        path: 'owner-enroll',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/owner').then((module) => module.OwnerModule)
      },
      {
        path: 'my-places',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/my-places').then((module) => module.MyPlacesModule),
        data: { prefetch: true }
      },
      {
        path: 'contribute/:storeType',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/contribute').then((module) => module.ContributeModule)
      }
    ])
  ],
  declarations: [StoreComponent, MeasuresComponent]
})
export class StoreDetailModule {}
