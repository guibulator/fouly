/*
 */
import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router, UrlTree } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class PlaceSearchLatLngGuard implements CanActivate {
  constructor(private readonly router: Router, private activatedRouteSnapshot: ActivatedRoute) {}
  canActivate(): UrlTree | boolean {
    const state = this.router?.getCurrentNavigation()?.extras?.state;
    if (!state || !state.lat || !state.lng) return this.router.parseUrl('/app/tabs/map');
    return true;
  }
}
