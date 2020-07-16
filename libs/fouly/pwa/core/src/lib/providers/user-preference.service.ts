import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BaseStorageObject } from './base-storage-object.service';

export interface UserPreference {
  language: string;
  darkTheme: boolean; // dark them is back !
}

@Injectable({ providedIn: 'root' })
export class UserPreferenceService extends BaseStorageObject<UserPreference> {
  constructor(protected storage: Storage) {
    super(storage, 'fouly_user_prefefence');
    this.init({
      language: navigator.language?.substr(0, 2) ?? 'fr',
      darkTheme: false
    });
  }

  setLanguage(lang: string) {
    this.modifyPref('language', lang).subscribe();
  }

  setDarkTheme(isDark: boolean) {
    this.modifyPref('darkTheme', isDark).subscribe();
  }
}
