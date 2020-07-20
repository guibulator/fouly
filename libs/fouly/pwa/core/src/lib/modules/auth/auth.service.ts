import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from 'angularx-social-login';
import { BehaviorSubject, from, of } from 'rxjs';
import { catchError, flatMap, map, mapTo, tap } from 'rxjs/operators';

/** Only aware of social login. No caching and user store. Will be handled by the userStore.
 * Simply subscribe to the public property currentUser$ and use login* method if not authenticated.
 * when currentUser$ emits null, the user has logged out. Upon initialisation, the service will
 * get the user from the local cookies(Note: cookie error on localhost, can't get user because of that)
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private _currentUser$ = new BehaviorSubject<SocialUser>(null);
  private _loginIn$ = new BehaviorSubject(false);
  currentUser$ = this._currentUser$.asObservable();
  loginIn$ = this._loginIn$.asObservable();

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private facebook: Facebook
  ) {
    authService.authState
      .pipe(
        map((socialUser) => {
          //console.log(socialUser);  //for debug purpose
          this._currentUser$.next(socialUser);
          return socialUser;
        })
      )
      .subscribe();
  }

  loginWithFacebook() {
    this._loginIn$.next(true);
    if (this.platform.is('cordova')) {
      from(this.facebook.login(['email', 'public_profile']))
        .pipe(flatMap(() => this.facebook.api('me?fields-id,name,email,first_name', [])))
        .pipe(
          tap((profile) =>
            this._currentUser$.next({ ...profile, firstName: profile['first_name'] })
          )
        )
        .subscribe();
    } else {
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
  }

  loginWithGoogle() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logout() {
    from(this.authService.signOut()).pipe(
      mapTo(true),
      catchError((e) => {
        console.error(e);
        return of(false);
      })
    );
  }
}
