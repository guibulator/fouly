import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { from, Observable, of, ReplaySubject } from 'rxjs';
import { flatMap } from 'rxjs/operators';

export interface UserPreference {
  language: string;
  darkTheme: boolean; // dark them is back !
}

@Injectable({ providedIn: 'root' })
export class UserPreferenceService {
  private readonly KEY = 'fouly_user_prefefence';
  private _userPreference$ = new ReplaySubject<UserPreference>(1);
  store$: Observable<UserPreference> = this._userPreference$.asObservable();
  constructor(private storage: Storage) {
    // This initialize with default or replay existing preference
    from(this.storage.get(this.KEY))
      .pipe(
        flatMap((userPref) => {
          if (userPref) {
            this._userPreference$.next(userPref);
            return of(null);
          }
          const prefDefault: UserPreference = {
            language: navigator.language?.substr(0, 2) ?? 'fr',
            darkTheme: false
          };
          this._userPreference$.next(prefDefault);

          return from(this.storage.set(this.KEY, prefDefault));
        })
      )
      .subscribe();
  }

  setLanguage(lang: string) {
    this.modifyPref('language', lang).subscribe();
  }

  setDarkTheme(isDark: boolean) {
    this.modifyPref('darkTheme', isDark).subscribe();
  }

  private modifyPref(key: string, value: any) {
    return from(this.storage.get(this.KEY)).pipe(
      flatMap((userPref) => {
        userPref = { ...userPref };
        userPref[key] = value;
        this._userPreference$.next(userPref);
        return this.storage.set(this.KEY, userPref);
      })
    );
  }
}
