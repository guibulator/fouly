import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
/**
 * The snapshots can contain information wether a store is closed or not.
 * If closed, redirect to the closed route.
 */
@Injectable({
  providedIn: 'root'
})
export class ContributeGuard implements CanActivate {
  private readonly isClosed = false;
  constructor(private readonly router: Router) {}
  canActivate(_route: ActivatedRouteSnapshot, stateSnap: RouterStateSnapshot) {
    const state = this.router['currentNavigation']?.extras?.state;
    if (!state?.hasOwnProperty('closed')) {
      this.router.navigateByUrl('/');
      return false;
    }
    if (state.closed) {
      if (stateSnap.url.indexOf('closed') > -1) return true;
      this.router.navigate([`${stateSnap.url}/closed`], { state: { closed: state.closed } });
    }
    return true;
  }
}
