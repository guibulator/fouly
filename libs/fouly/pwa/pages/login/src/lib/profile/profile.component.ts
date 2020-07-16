import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@skare/fouly/pwa/core';
import { SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';

@Component({
  selector: 'fouly-profile-component',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  firstTimeRegister = true;
  user$: Observable<SocialUser>;
  constructor(private authService: AuthenticationService) {
    this.user$ = this.authService.currentUser$;
  }

  ngOnInit() {}

  logout() {}
}
