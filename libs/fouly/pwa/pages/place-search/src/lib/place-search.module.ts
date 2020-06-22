import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { PlaceSearchLatLngGuard } from './guards/place-search-lat-lng.guard';
import { SearchComponent } from './search/search.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/placesearch-', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FoulyUiModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: SearchComponent,
        canActivate: [PlaceSearchLatLngGuard]
      }
    ]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  declarations: [SearchComponent]
})
export class PlaceSearchModule {}
