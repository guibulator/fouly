import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { ClosedComponent } from './closed/closed.component';
import { ContributeGuard } from './contribute.guard';
import { SurveyFormComponent } from './survey-form/survey-form.component';
import { DelayComponent } from './surveys/delay/delay.component';
import { InstallationComponent } from './surveys/installation/installation.component';
import { NumberComponent } from './surveys/number/number.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
    FoulyUiModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: SurveyFormComponent,
        canActivate: [ContributeGuard]
      },
      {
        path: 'closed',
        component: ClosedComponent,
        canActivate: [ContributeGuard]
      },
      {
        path: ':placeId',
        pathMatch: 'full',
        component: SurveyFormComponent,
        canActivate: [ContributeGuard]
      }
    ])
  ],
  declarations: [
    SurveyFormComponent,
    DelayComponent,
    ClosedComponent,
    InstallationComponent,
    NumberComponent
  ]
})
export class ContributeModule {}
