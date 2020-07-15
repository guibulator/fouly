/// <reference types="googlemaps" />
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { finalize, shareReplay, take, tap } from 'rxjs/operators';
/**
 * Provides a set a basic functionnality to add/remove/fetch anything from storage
 */
export class BaseStorage<T> {
  private readonly _store$ = new BehaviorSubject<T[]>([]);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private alreadyInit = false;
  readonly store$ = this._store$.asObservable();
  readonly loading$ = this._loading$.asObservable();
  constructor(
    protected storage: Storage,
    protected storageKey: string,
    private keyAccessor: (T) => string
  ) {}

  clear() {
    this.storage.set(this.storageKey, []);
  }

  add(toAdd: T): void {
    // optimistic save
    this._store$.pipe(take(1)).subscribe((items) => {
      items = [...this._store$.getValue(), toAdd]; // keep structure immutable
      this._store$.next(items);
      this.storage.set(this.storageKey, items);
    });
  }

  remove(id: string): void {
    // optimistic save
    this._store$.pipe(take(1)).subscribe((items) => {
      items = items.filter((p) => (this.keyAccessor ? this.keyAccessor(p) !== id : true));
      this._store$.next([...items]); // keep structure immutable
      this.storage.set(this.storageKey, items);
    });
  }

  getAll(): Observable<T[]> {
    if (this.alreadyInit) return this.store$;
    this._loading$.next(true);
    return from(this.storage.get(this.storageKey)).pipe(
      tap((items) => this._store$.next([...(items ?? [])])),
      shareReplay(1),
      finalize(() => {
        this._loading$.next(false);
        this.alreadyInit = true;
      })
    );
  }
}
