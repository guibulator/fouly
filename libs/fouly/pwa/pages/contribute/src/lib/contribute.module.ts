import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { SurveyFormComponent } from './survey-form/survey-form.component';
import { DelayComponent } from './surveys/delay/delay.component';
import { InstallationComponent } from './surveys/installation/installation.component';
import { NumberComponent } from './surveys/number/number.component';
import { ThanksComponent } from './surveys/thanks/thanks.component';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/contribute-', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateModule,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    IonicModule,
    FoulyUiModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: SurveyFormComponent },
      { path: ':placeId', pathMatch: 'full', component: SurveyFormComponent }
    ])
  ],
  declarations: [
    SurveyFormComponent,
    DelayComponent,
    InstallationComponent,
    NumberComponent,
    ThanksComponent
  ]
})
export class ContributeModule {}
