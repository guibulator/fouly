import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import { UserResult } from '@skare/fouly/data';
import { UserLoginService } from '@skare/fouly/pwa/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser
} from 'angularx-social-login';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public userData: UserResult = null;
  public loggedIn = false;
  public showAnonymousLogin = true;
  public showUserNameInput = false;
  public showFbLogin = true;
  public showGoogleLogin = true;
  public userName = new FormControl('');

  constructor(
    private facebook: Facebook,
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private userLoginService: UserLoginService
  ) {}

  ngOnInit(): void {
    this.userLoginService.init().subscribe((user: UserResult) => {
      this.loginUser(user);
      if (user) {
        this.manageLoginOptions(user.loginFrom);
      }
    });

    this.authService.authState.subscribe((user: SocialUser) => {
      this.loginUser(user);
    });

    this.userName.valueChanges.subscribe((val: string) => {
      this.userData = null;
      this.loginUser({ name: val });
    });
  }

  loginUser(user: any) {
    if (user && !this.userData) {
      if (user.provider) this.manageLoginOptions(user.provider.toLowerCase());
      this.userData = {
        id: user.id,
        email: user.email,
        first_name: user.first_name ? user.first_name : user.firstName,
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
    this.userLoginService.addUpdateUser(this.userData);
    this.router.navigateByUrl('/');
  }

  logout(): void {
    this.userData = null;
    this.loggedIn = false;
    this.manageLoginOptions('');
    this.userLoginService.removeUser();
  }
}
