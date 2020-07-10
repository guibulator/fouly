import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
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
      { path: ':placeName', pathMatch: 'full', component: OwnerProposedSolutionComponent }
    ])
  ],
  declarations: [OwnerProposedSolutionComponent]
})
export class OwnerModule {}
