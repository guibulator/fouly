import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserCommand, UserResult } from '@skare/fouly/data';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { finalize, shareReplay, take, tap } from 'rxjs/operators';
import { ConfigService } from '../modules/config/config.service';

@Injectable({ providedIn: 'root' })
export class UserLoginService {
  private readonly _user$ = new BehaviorSubject<UserResult>(null);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private alreadyInit = false;
  readonly user$ = this._user$.asObservable();
  readonly loading$ = this._loading$.asObservable();
  private readonly apiEndPoint: string;
  constructor(
    private storage: Storage,
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.apiEndPoint = this.configService.apiUrl;
  }

  addUpdateUser(user: UserResult): Observable<any> {
    this._user$.pipe(take(1)).subscribe(() => {
      this._user$.next(user);
      this.storage.set('fouly_user', user);
    });
    const userCmd: UserCommand = {
      name: user.name,
      firstName: user.first_name,
      email: user.email,
      id: '',
      loginFrom: user.loginFrom,
      picture: user.picture
    };
    return this.httpClient.post(`${this.apiEndPoint}/user/create`, userCmd);
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
