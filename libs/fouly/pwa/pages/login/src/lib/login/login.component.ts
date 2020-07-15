import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { flatMap, take } from 'rxjs/operators';

@Component({
  selector: 'fouly-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  public userData: UserResult = null;
  public userLoginFrom: string;
  public loggedIn = false;
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
    this.authService.readyState
      .pipe(flatMap(() => this.userStoreService.getAll().pipe(take(1))))
      .subscribe((users: UserResult[]) => {
        const user = users && users.length > 0 && users[0];
        user && this.updateUserData(user);
      });

    this.subscriptions.add(
      this.authService.authState.subscribe((user: SocialUser) => {
        if (!!user && !this.userData) {
          this.updateUserData(user);
          setTimeout(() => this.saveUserAndQuit(), 3000);
        } else {
          // login didn't work
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private updateUserData(user: any) {
    this.userData = {
      userId: user?.userId,
      providerId: user?.providerId,
      email: user?.email,
      firstName: user.first_name ? user.first_name : user.firstName ? user.firstName : null,
      name: user?.name,
      picture: user?.picture ?? user?.photoUrl,
      loginFrom: user?.loginFrom ?? user?.provider ?? this.userLoginFrom
    };
    this.loggedIn = true;
  }

  loginWithFB() {
    this.userLoginFrom = 'facebook';
    if (this.platform.is('cordova')) {
      this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
        this.facebook.api('me?fields-id,name,email,first_name', []).then((profile) => {
          this.updateUserData({ ...profile, firstName: profile['first_name'] });
        });
      });
    } else {
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
  }

  loginWithGoogle(): void {
    this.userLoginFrom = 'google';
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  private saveUserAndQuit(): void {
    this.userStoreService.createUpdateUser(this.userData).subscribe((user: UserResult) => {
      this.userStoreService.clear();
      this.userStoreService.add(user);
      this.userData = { ...user };
      this.navController.back();
    });
  }

  async logout() {
    const id = this.userData?.userId;
    this.userStoreService.clear();
    //this.userStoreService.remove(id);
    if (this.loggedIn) {
      try {
        await this.authService.signOut(true);
      } catch (ex) {
        console.error(ex);
      }
    }
    this.loggedIn = false;
    this.userData = null;
  }
}
