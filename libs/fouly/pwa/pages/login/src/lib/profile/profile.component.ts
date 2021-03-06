import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@skare/fouly/pwa/core';
import { SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';

@Component({
  selector: 'fouly-profile-component',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent {
  firstTimeRegister = true;
  user$: Observable<SocialUser>;
  constructor(private authService: AuthenticationService, private router: Router) {
    this.user$ = this.authService.currentUser$;
  }
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
