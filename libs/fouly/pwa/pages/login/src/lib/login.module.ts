import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IsUserAuthenticatedGuard } from '@skare/fouly/pwa/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { RedirectToProfileIfLoggedInGuard } from './guards/redirect-to-profile.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [LoginComponent, ProfileComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FoulyUiModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'login',
        pathMatch: '',
        component: LoginComponent,
        canActivate: [RedirectToProfileIfLoggedInGuard],
        data: { title: 'page.identity.login.title' }
      },
      {
        path: 'profile',
        pathMatch: '',
        component: ProfileComponent,
        canActivate: [IsUserAuthenticatedGuard],
        data: { title: 'page.identity.profile.title' }
      }
    ])
  ],
  providers: []
})
export class LoginModule {}
