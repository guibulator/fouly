import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ReplaySubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { uuid } from 'uuidv4';
import { BaseStorageObject } from './base-storage-object.service';
export type FoulyAuthProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK';
export interface UserPreference {
  language: string;
  darkTheme: boolean; // dark them is back !
  userId: string;
  numberOfFavorites: number;
  firstTimeUser: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserPreferenceService extends BaseStorageObject<UserPreference> {
  private _init$ = new ReplaySubject(1);
  initialized$ = this._init$.asObservable();
  constructor(protected storage: Storage) {
    super(storage, 'fouly_user_prefefence');
    this.init({
      language: navigator.language?.substr(0, 2) ?? 'fr',
      darkTheme: false,
      userId: `localuser-${uuid()}`,
      numberOfFavorites: 0,
      firstTimeUser: true
    })
      .pipe(finalize(() => this._init$.next(true)))
      .subscribe();
  }

  setLanguage(lang: string) {
    this.modifyPref('language', lang).subscribe();
  }

  setDarkTheme(isDark: boolean) {
    this.modifyPref('darkTheme', isDark).subscribe();
  }

  setUserId(userId: string) {
    this.modifyPref('userId', userId).subscribe();
  }

  setNumberOfFavorites(count: number, emit = true) {
    this.modifyPref('numberOfFavorites', count, emit).subscribe();
  }

  setFirstTimeUser(value: boolean) {
    this.modifyPref('firstTimeUser', value).subscribe();
  }
}
