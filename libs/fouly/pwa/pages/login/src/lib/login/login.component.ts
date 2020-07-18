import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterSignupSyncService,
  AuthenticationService,
  UserStoreService
} from '@skare/fouly/pwa/core';
import { Observable, Subscription } from 'rxjs';
import { filter, flatMap } from 'rxjs/operators';

@Component({
  selector: 'fouly-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginIn$: Observable<boolean>;
  private readonly subscriptions = new Subscription();
  constructor(
    private authService: AuthenticationService,
    private userStoreService: UserStoreService,
    private router: Router,
    private route: ActivatedRoute,
    private afterSignupSyncService: AfterSignupSyncService
  ) {}

  ngOnInit(): void {
    this.loginIn$ = this.authService.loginIn$;
    this.subscriptions.add(
      this.authService.currentUser$
        .pipe(
          filter((user) => !!user),
          flatMap(() => this.afterSignupSyncService.sync()),
          flatMap((user: any) => this.userStoreService.createUpdateUser(user))
        )
        .subscribe(() => this.router.navigateByUrl('identity/profile'))
    );
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
