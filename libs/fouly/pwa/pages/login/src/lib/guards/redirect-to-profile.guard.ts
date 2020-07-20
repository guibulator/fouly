import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '@skare/fouly/pwa/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RedirectToProfileIfLoggedInGuard implements CanActivate {
  constructor(private router: Router, private readonly authService: AuthenticationService) {}
  canActivate(_, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    // if we come from login page and user is logged in, redirect to the root
    const result$ = this.authService.currentUser$.pipe(
      map((user) => {
        if (user) {
          if (state.url === '/identity/login') return this.router.parseUrl('/');
          return this.router.parseUrl('/identity/profile');
        }
        return true;
      })
    );
    return result$;
  }
}
