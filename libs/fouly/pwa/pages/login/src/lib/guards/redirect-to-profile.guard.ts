import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '@skare/fouly/pwa/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class RedirectToProfileIfLoggedInGuard implements CanActivate {
  constructor(private router: Router, private readonly authService: AuthenticationService) {}
  canActivate(): Observable<boolean | UrlTree> {
    const result$ = this.authService.currentUser$.pipe(
      map((user) => {
        if (user) return this.router.parseUrl('/identity/profile');
        return true;
      })
    );
    return result$;
  }
}
