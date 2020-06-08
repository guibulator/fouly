import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserResult } from '@skare/fouly/data';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { finalize, shareReplay, take, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserLoginService {
  private readonly _user$ = new BehaviorSubject<UserResult>(null);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private alreadyInit = false;
  readonly user$ = this._user$.asObservable();
  readonly loading$ = this._loading$.asObservable();
  constructor(private storage: Storage) {}

  addUpdateUser(user: UserResult) {
    this._user$.pipe(take(1)).subscribe(() => {
      this._user$.next(user);
      this.storage.set('fouly_user', user);
    });
  }

  removeUser() {
    this._user$.pipe(take(1)).subscribe((users) => {
      this._user$.next(null);
      this.storage.set('fouly_user', null);
    });
  }

  init(): Observable<UserResult> {
    if (this.alreadyInit) return this.user$;
    this._loading$.next(true);
    return from(this.storage.get('fouly_user')).pipe(
      tap((user) => this._user$.next(user)),
      shareReplay(1),
      finalize(() => {
        this._loading$.next(false);
        this.alreadyInit = true;
      })
    );
  }
}
