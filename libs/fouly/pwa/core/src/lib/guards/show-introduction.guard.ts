import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class ShowIntroductionGuard implements CanActivate {
  constructor(private readonly router: Router, private storage: Storage) {}
  canActivate(): Promise<boolean | UrlTree> {
    return this.storage.get('fouly_did_introduction').then((res) => {
      if (res === true) {
        return this.router.parseUrl('/app/tabs/map');
      }
      return true;
    });
  }
}
