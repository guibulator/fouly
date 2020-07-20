import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../modules/auth';
import { UserPreferenceService } from '../providers/local-storage/user-preference.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private AUTH_HEADER = 'Authorization';
  private USER_HEADER = 'User-Id';
  constructor(
    private authService: AuthenticationService,
    private userPrefService: UserPreferenceService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json')
      });
    }
    return this.addAuthenticationToken(req).pipe(
      flatMap((request) => this.addUserId(request)),
      flatMap((request) => next.handle(request))
    );
  }

  private addAuthenticationToken(request: HttpRequest<any>): Observable<HttpRequest<any>> {
    return zip(this.authService.currentUser$).pipe(
      take(1),
      map(([user]) => {
        if (user?.authToken) {
          return request.clone({
            headers: request.headers.set(this.AUTH_HEADER, 'Bearer ' + user.authToken)
          });
        }
        return request;
      })
    );
  }

  private addUserId(request: HttpRequest<any>): Observable<HttpRequest<any>> {
    return zip(this.authService.currentUser$, this.userPrefService.store$).pipe(
      take(1),
      map(([user, pref]) =>
        request.clone({
          headers: request.headers.set(this.USER_HEADER, user?.id ?? pref.userId)
        })
      )
    );
  }
}
