
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class CheckIntroductionService implements CanLoad {
  constructor(private storage: Storage, private router: Router) {}

  canLoad() {
    return this.storage.get('fouly_did_introduction').then(res => {
      // todo: check if the user has liked places, in this case, we will show the list instead of the map to save on api cost.
      if (res) {
        this.router.navigate(['/app', 'tabs', 'map']);
        return false;
      } else {
        return true;
      }
    });
  }
}

