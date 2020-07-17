/// <reference types="googlemaps" />
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserCommand, UserResult } from '@skare/fouly/data';
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

  /** Will also emit when observers observes store$ */
  createUpdateUser(user: UserResult): Observable<UserResult> {
    const userCmd: UserCommand = { ...user };
    return this.httpClient.post<UserResult>(`${this.apiEndPoint}/user/create`, userCmd);
  }
}
