import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, UserStoreService } from '@skare/fouly/pwa/core';
import { Observable, Subscription } from 'rxjs';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginIn$ = this.authService.loginIn$;
    this.subscriptions.add(
      this.authService.currentUser$.subscribe((user) => {
        if (!user) {
          console.log('no user');
        } else {
          console.log('user', user);
          this.saveUserAndRedirect(user);
          this.router.navigate(['profile'], { relativeTo: this.route });
        }
      })
    );
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  private saveUserAndRedirect(user): void {
    this.userStoreService
      .createUpdateUser(user)
      .subscribe(() => console.log('User stored in system!'));
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
