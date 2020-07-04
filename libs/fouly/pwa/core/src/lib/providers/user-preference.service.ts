import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { BaseStorage } from './base-storage.service';

interface UserPreference {
  language: string;
  //darkTheme: boolean  // dark theme si il revient un jour :)
}

@Injectable({ providedIn: 'root' })
export class UserPreferenceService {
  private userStorage: BaseStorage<UserPreference>;
  constructor(private storage: Storage) {
    this.userStorage = new BaseStorage<UserPreference>(
      storage,
      'fouly_user_prefefence',
      (u) => null
    );
  }

  public async GetLanguage(): Promise<string> {
    const up = await this.userStorage
      .getAll()
      .pipe(
        map(
          (d) =>
            (Array.isArray(d) ? d[0] : null) ?? {
              language: navigator.language?.substr(0, 2) ?? 'fr'
            }
        )
      )
      .toPromise();
    return up.language;
  }

  public SetLanguage(lang: string) {
    this.userStorage.remove(null);
    this.userStorage.add({ language: lang });
  }
}
