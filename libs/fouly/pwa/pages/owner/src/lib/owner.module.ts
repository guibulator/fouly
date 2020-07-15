import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { CodeValidationComponent } from './code-validation/code-validation.component';
import { OwnerComponent } from './owner/owner.component';
import { OwnerProposedSolutionComponent } from './proposed-solution/proposed-solution.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    FoulyUiModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        component: OwnerComponent,
        children: [
          {
            path: 'solution',
            component: OwnerProposedSolutionComponent,
            data: { title: 'page.owner.childRoute.solution.title' },
            outlet: 'temp'
          },
          {
            path: 'code-validation',
            component: CodeValidationComponent,
            data: { title: 'page.owner.childRoute.codeValidation.title' },
            outlet: 'temp'
          },
          {
            path: '',
            component: OwnerProposedSolutionComponent,
            data: { title: 'page.owner.childRoute.solution.title' },
            outlet: 'temp'
          }
        ]
      },
      {}
    ])
  ],
  declarations: [OwnerProposedSolutionComponent, CodeValidationComponent, OwnerComponent]
})
export class OwnerModule {}
