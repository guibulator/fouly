import { Inject, Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from 'angularx-social-login';
import { combineLatest, from, Observable, ReplaySubject, zip } from 'rxjs';
import { debounceTime, filter, finalize, flatMap, tap } from 'rxjs/operators';
import { AuthProvidersConfig, AUTH_PROVIDERS_CONFIG } from '.';
import { UserPreferenceService } from '../../providers/local-storage/user-preference.service';

/** Only aware of social login. No caching and user store. Will be handled by the userStore.
 * Simply subscribe to the public property currentUser$ and use login* method if not authenticated.
 * when currentUser$ emits null, the user has logged out. Upon initialisation, the service will
 * get the user from the local cookies
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private _loginIn$ = new ReplaySubject<boolean>(1);
  private _currentUser$ = new ReplaySubject<SocialUser>(1);
  currentUser$: Observable<SocialUser> = this._currentUser$.asObservable();
  loginIn$ = this._loginIn$.asObservable();

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private facebook: Facebook,
    private userPref: UserPreferenceService,
    @Inject(AUTH_PROVIDERS_CONFIG) private config: AuthProvidersConfig
  ) {
    // Wait that all config are registered
    // sometimes a null is emitted but the user is almost instantly emitted after
    combineLatest([this.authService.readyState, this.authService.authState])
      .pipe(
        filter(([configs]) => configs?.length === Object.keys(this.config).length),
        debounceTime(200),
        tap(([_, user]) => {
          //  console.log('READY_STATE" user is ', user); //debug purpose
          this._currentUser$.next(user);
          return user;
        })
      )
      .subscribe();
  }

  loginWithFacebook() {
    this._loginIn$.next(true);
    if (this.platform.is('cordova')) {
      return from(this.facebook.login(['email', 'public_profile']))
        .pipe(flatMap(() => this.facebook.api('me?fields-id,name,email,first_name', [])))
        .pipe(
          tap((profile) =>
            this._currentUser$.next({ ...profile, firstName: profile['first_name'] })
          ),
          finalize(() => this._loginIn$.next(false))
        );
    } else {
      return zip(
        from(this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)),
        this.userPref.initialized$
      ).pipe(finalize(() => this._loginIn$.next(false)));
    }
  }

  loginWithGoogle() {
    this._loginIn$.next(true);
    return zip(
      from(this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)),
      this.userPref.initialized$
    ).pipe(finalize(() => this._loginIn$.next(false)));
  }

  logout() {
    this.authService.signOut();
  }
}
