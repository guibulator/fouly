import {
  Inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import {
  AuthServiceConfig,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LoginOpt
} from 'angularx-social-login';
import { AuthServiceConfigItem } from 'angularx-social-login/auth.service';

const AUTH_PROVIDERS_CONFIG = new InjectionToken<Partial<AuthProvidersConfig>>(
  'AuthProvidersConfig'
);

export interface AuthProvidersConfig {
  google: string;
  facebook: string;
}

const fbLoginOptions: LoginOpt = {
  scope: 'email',
  return_scopes: true,
  enable_profile_selector: true
};

const googleLoginOptions: LoginOpt = {
  scope: 'profile email'
};

export function provideConfigFactory(authConfig: AuthProvidersConfig) {
  const configs: AuthServiceConfigItem[] = [];
  if (authConfig.google) {
    configs.push({
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(authConfig.google, googleLoginOptions)
    });
  }
  if (authConfig.facebook) {
    configs.push({
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(authConfig.facebook, fbLoginOptions)
    });
  }
  return new AuthServiceConfig(configs);
}
@NgModule({
  imports: []
})
export class FoulyAuthModule {
  constructor(@Optional() @SkipSelf() parentModule: FoulyAuthModule) {
    if (parentModule) {
      throw new Error('FoulyAuthModule is already loaded. Please add it in AppModule only.');
    }
  }
  static forRoot(authConfig: AuthProvidersConfig): ModuleWithProviders {
    return {
      ngModule: FoulyAuthModule,
      providers: [
        { provide: AUTH_PROVIDERS_CONFIG, useValue: authConfig },
        {
          provide: AuthServiceConfig,
          useFactory: provideConfigFactory,
          deps: [[new Inject(AUTH_PROVIDERS_CONFIG)]]
        },
        Facebook
      ]
    };
  }
}
