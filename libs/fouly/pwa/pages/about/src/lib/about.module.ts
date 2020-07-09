import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { AboutComponent } from './about.component';
@NgModule({
  imports: [
    CommonModule,
    FoulyUiModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: AboutComponent }])
  ],
  declarations: [AboutComponent]
})
export class AboutModule {}
