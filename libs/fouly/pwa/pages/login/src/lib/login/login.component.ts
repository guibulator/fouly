import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import { UserResult } from '@skare/fouly/data';
import { UserStoreService } from '@skare/fouly/pwa/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from 'angularx-social-login';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fouly-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public userData: UserResult = null;
  private userFouly: UserResult = null;
  public loggedIn = false;
  public showAnonymousLogin = true;
  public showUserNameInput = false;
  public showFbLogin = true;
  public showGoogleLogin = true;
  public userName = new FormControl('');
  private readonly subscriptions = new Subscription();
  constructor(
    private facebook: Facebook,
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private userStoreService: UserStoreService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userStoreService.getAll().subscribe((users: UserResult[]) => {
        const user = users && users.length > 0 && users[0];
        this.loginUser(user);
        if (user) {
          this.manageLoginOptions(user.loginFrom);
        }
      })
    );

    this.subscriptions.add(
      this.authService.authState.subscribe((user: SocialUser) => {
        this.loginUser(user);
      })
    );

    this.userName.valueChanges.subscribe((val: string) => {
      this.userData = null;
      this.loginUser({ name: val });
    });
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loginUser(user: any) {
    if (user && !this.userData) {
      if (user.provider) this.manageLoginOptions(user.provider.toLowerCase());
      this.userData = {
        id: user.id,
        email: user.email,
        firstName: user.first_name ? user.first_name : user.firstName,
        name: user.name,
        picture: user.picture ? user.picture : user.photoUrl,
        loginFrom: user.loginFrom
          ? user.loginFrom
          : user.provider
          ? user.provider.toLowerCase()
          : this.getLoginFrom()
      };
      this.loggedIn = true;
    }
  }

  loginWithFB() {
    this.manageLoginOptions('facebook');
    if (this.platform.is('cordova')) {
      this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
        this.facebook.api('me?fields-id,name,email,first_name', []).then((profile) => {
          this.loginUser({ ...profile, firstName: profile['first_name'] });
        });
      });
    } else {
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
  }

  loginWithGoogle(): void {
    this.manageLoginOptions('google');
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  loginAnonymus(): void {
    this.manageLoginOptions('anonymous');
    this.showUserNameInput = true;
  }

  manageLoginOptions(loginWith: string): void {
    switch (loginWith) {
      case 'google':
        this.showGoogleLogin = true;
        this.showFbLogin = false;
        this.showAnonymousLogin = false;
        break;
      case 'facebook':
        this.showGoogleLogin = false;
        this.showFbLogin = true;
        this.showAnonymousLogin = false;
        break;
      case 'anonymous':
        this.showGoogleLogin = false;
        this.showFbLogin = false;
        this.showAnonymousLogin = true;
        break;
      default:
        this.showGoogleLogin = true;
        this.showFbLogin = true;
        this.showAnonymousLogin = true;
        this.showUserNameInput = false;
        this.loggedIn = false;
    }
  }

  getLoginFrom(): string {
    if (this.showGoogleLogin && !this.showFbLogin && !this.showAnonymousLogin) return 'google';
    if (this.showFbLogin && !this.showGoogleLogin && !this.showAnonymousLogin) return 'facebook';
    if (this.showAnonymousLogin && !this.showFbLogin && !this.showGoogleLogin) return 'anonymous';
  }

  login(): void {
    this.userStoreService.add(this.userData);
    this.router.navigateByUrl('/');
  }

  async logout() {
    if (this.userData.loginFrom !== 'anonymous') {
      await this.authService.signOut();
    }

    const id = this.userData?.id;
    this.userData = null;
    this.loggedIn = false;
    this.manageLoginOptions('');
    this.userStoreService.remove(id);
  }
}
