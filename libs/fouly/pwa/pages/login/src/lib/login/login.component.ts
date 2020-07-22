import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterSignupSyncService,
  AuthenticationService,
  UserPreferenceService,
  UserStoreService
} from '@skare/fouly/pwa/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';

@Component({
  selector: 'fouly-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginIn$: Observable<boolean>;
  private readonly subscriptions = new Subscription();
  constructor(
    private authService: AuthenticationService,
    private userPrefService: UserPreferenceService,
    private userStoreService: UserStoreService,
    private router: Router,
    private route: ActivatedRoute,
    private afterSignupSyncService: AfterSignupSyncService
  ) {}

  ngOnInit(): void {
    this.loginIn$ = this.authService.loginIn$;
    this.userPrefService.init();
    this.subscriptions.add(
      combineLatest([this.authService.currentUser$, this.userPrefService.store$])
        .pipe(
          filter(([user, pref]) => !!user),
          flatMap((source) => this.afterSignupSyncService.sync().pipe(map(() => source))),
          flatMap(([user, { language }]) => this.userStoreService.createUpdateUser(user, language))
        )
        .subscribe(() => this.router.navigate(['/identity/profile']))
    );
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().subscribe();
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
