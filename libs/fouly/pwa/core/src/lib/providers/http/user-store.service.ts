/// <reference types="googlemaps" />
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserCommand, UserResult } from '@skare/fouly/data';
import { SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { ConfigService } from '../../modules/config/config.service';

@Injectable({ providedIn: 'root' })
export class UserStoreService {
  private readonly apiEndPoint: string;

  constructor(
    protected storage: Storage,
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.apiEndPoint = this.configService.apiUrl;
  }

  createUpdateUser(socialUser: SocialUser, lang: string): Observable<UserResult> {
    const userCmd: UserCommand = {
      ...socialUser,
      lang,
      userId: socialUser.id,
      provider: socialUser.provider
    };
    return this.httpClient.post<UserResult>(`${this.apiEndPoint}/user`, userCmd);
  }
}
