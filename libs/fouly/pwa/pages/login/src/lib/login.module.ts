import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Facebook } from '@ionic-native/facebook/ngx';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import {
  AuthServiceConfig,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LoginOpt,
  SocialLoginModule
} from 'angularx-social-login';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const fbLoginOptions: LoginOpt = {
  scope: 'email',
  return_scopes: true,
  enable_profile_selector: true
};

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
};

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(
      '316973135009-3sn6m7vc4313q36g4lnec9ttqmpo7l2s.apps.googleusercontent.com',
      googleLoginOptions
    )
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('250123776255481', fbLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}
@NgModule({
  declarations: [LoginComponent, ProfileComponent],
  imports: [
    CommonModule,
    IonicModule,
    SocialLoginModule,
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
        data: { title: 'page.identity.login.title' }
      },
      {
        path: 'profile/:welcome',
        pathMatch: '',
        component: ProfileComponent,
        data: { title: 'page.identity.profile.title' }
      }
    ])
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    Facebook
  ]
})
export class LoginModule {}
