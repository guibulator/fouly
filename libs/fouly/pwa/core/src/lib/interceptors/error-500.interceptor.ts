import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class Error500Interceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        console.log(request);
        // in some cases, initiator of the request will handle the error itself.
        // TODO: Make this configurable i.e. ignore500Redirect.registerUrl('.../api/geo')
        if (!request.url.endsWith('api/geo')) {
          this.router.navigateByUrl('error');
        }
        return throwError(error);
      })
    );
  }
}
