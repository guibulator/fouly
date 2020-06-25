import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { MeasuresComponent } from './measures/measures.component';
import { StoreComponent } from './store.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/store-', '.json');
}
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FoulyUiModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
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
          import('@skare/fouly/pwa/pages/my-places').then((module) => module.MyPlacesModule),
        data: { prefetch: true }
      },
      {
        path: 'contribute',
        loadChildren: () =>
          import('@skare/fouly/pwa/pages/contribute').then((module) => module.ContributeModule)
      }
    ])
  ],
  declarations: [StoreComponent, MeasuresComponent]
})
export class StoreDetailModule {}
