import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { NavController, Platform } from '@ionic/angular';
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
  private userLoginFrom = '';
  public loggedIn = false;
  public showUserNameInput = false;
  public userName = new FormControl('');
  public canLogin = false;
  private readonly subscriptions = new Subscription();
  constructor(
    private facebook: Facebook,
    private platform: Platform,
    private authService: AuthService,
    private userStoreService: UserStoreService,
    private navController: NavController
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userStoreService.getAll().subscribe((users: UserResult[]) => {
        const user = users && users.length > 0 && users[0];
        this.loginUser(user);
      })
    );

    this.subscriptions.add(
      this.authService.authState.subscribe((user: SocialUser) => {
        const isUserWasLogued = this.loggedIn;
        this.loginUser(user);
        if (this.loggedIn && !isUserWasLogued) {
          setTimeout(() => this.login(), 1000);
        }
      })
    );

    this.userName.valueChanges.subscribe((val: string) => {
      if (val.length > 0) {
        this.canLogin = true;
      }
      if (this.userData) {
        this.loginUser({ ...this.userData, name: val });
      } else {
        this.loginUser({ name: val });
      }
    });
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loginUser(user: any) {
    if (user) {
      this.userData = {
        userId: user.userId ? user.userId : null,
        providerId: user.providerId ? user.providerId : null,
        email: user.email ? user.email : null,
        firstName: user.first_name ? user.first_name : user.firstName ? user.firstName : null,
        name: user.name ? user.name : null,
        picture: user.picture ? user.picture : user.photoUrl ? user.photoUrl : null,
        loginFrom: user.loginFrom
          ? user.loginFrom
          : user.provider
          ? user.provider.toLowerCase()
          : this.userLoginFrom
      };
      this.loggedIn = true;
    }
  }

  loginWithFB() {
    this.userLoginFrom = 'facebook';
    this.showUserNameInput = false;
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
    this.userLoginFrom = 'google';
    this.showUserNameInput = false;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  loginAnonymus(): void {
    this.userLoginFrom = 'anonymous';
    this.showUserNameInput = true;
  }

  login(): void {
    this.userStoreService.createUpdateUser(this.userData).subscribe((user: UserResult) => {
      this.userStoreService.add(user);
      this.userData = { ...user };
      this.navController.back();
    });
  }

  async logout() {
    const id = this.userData?.userId;
    this.userStoreService.remove(id);
    if (this.userData.loginFrom !== 'anonymous' && this.loggedIn) {
      await this.authService.signOut();
    }
    this.loggedIn = false;
    this.userData = null;
  }
}
