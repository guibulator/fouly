/// <reference types="googlemaps" />
import { Storage } from '@ionic/storage';
import { from, Observable, of, ReplaySubject } from 'rxjs';
import { flatMap } from 'rxjs/operators';
/**
 * Provides a set a basic functionnality for object storage.
 */
export class BaseStorageObject<T> {
  private _store$ = new ReplaySubject<T>(1);
  store$: Observable<T> = this._store$.asObservable();

  constructor(protected storage: Storage, protected key: string) {}

  /**
   * Call this method once in the parent class but is not mandatory to call.
   * @param state
   */
  init(state?: T) {
    // This initialize with default or replay existing preference
    from(this.storage.get(this.key))
      .pipe(
        flatMap((item) => {
          if (item) {
            this._store$.next(item);
            return of(null);
          }

          state && this._store$.next(state);
          return from(this.storage.set(this.key, state));
        })
      )
      .subscribe();
  }

  protected modifyPref(key: string, value: any) {
    return from(this.storage.get(this.key)).pipe(
      flatMap((item: any) => {
        item = { ...item };
        item[key] = value;
        this._store$.next(item);
        return this.storage.set(this.key, item);
      })
    );
  }
}
