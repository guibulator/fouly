/// <reference types="googlemaps" />
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserCommand, UserResult } from '@skare/fouly/data';
import { Observable } from 'rxjs';
import { ConfigService } from '../modules/config/config.service';
import { BaseStorage } from './base-storage.service';
@Injectable({ providedIn: 'root' })
export class UserStoreService extends BaseStorage<UserResult> {
  private readonly apiEndPoint: string;

  constructor(
    protected storage: Storage,
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    super(storage, 'fouly_user_store', (user: UserResult) => user?.id);
    this.apiEndPoint = this.configService.apiUrl;
  }

  createUpdateUser(user: UserResult): Observable<any> {
    const userCmd: UserCommand = { ...user };
    return this.httpClient.post(`${this.apiEndPoint}/user/create`, userCmd);
  }

  getUserFromEmail(email: string): Observable<any> {
    return this.httpClient.get(`${this.apiEndPoint}/user/getByEmail/${email}`);
  }
}
