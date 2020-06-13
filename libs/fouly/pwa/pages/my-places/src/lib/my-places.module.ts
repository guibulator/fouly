import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { FavoritesComponent } from './favorites/favorites.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/favorites-', '.json');
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
      {
        path: '',
        component: FavoritesComponent
      }
    ])
  ],
  declarations: [FavoritesComponent]
})
export class MyPlacesModule {}
