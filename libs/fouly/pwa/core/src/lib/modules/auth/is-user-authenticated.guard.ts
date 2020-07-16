import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class IsUserAuthenticatedGuard implements CanActivate {
  constructor(private router: Router, private readonly authService: AuthenticationService) {}
  canActivate(): Observable<boolean | UrlTree> {
    const result$ = this.authService.currentUser$.pipe(
      map((user) => {
        if (user) return true;
        return this.router.parseUrl('/login');
      })
    );
    return result$;
  }
}
