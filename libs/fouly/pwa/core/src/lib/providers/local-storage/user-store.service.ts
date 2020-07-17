/// <reference types="googlemaps" />
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserCommand, UserResult } from '@skare/fouly/data';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ConfigService } from '../../modules/config/config.service';
import { BaseStorage } from './base-storage.service';
@Injectable({ providedIn: 'root' })
export class UserStoreService extends BaseStorage<UserResult> {
  private readonly apiEndPoint: string;

  constructor(
    protected storage: Storage,
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    super(storage, 'fouly_user_store', (user: UserResult) => user?.userId);
    this.apiEndPoint = this.configService.apiUrl;
  }

  /** Will also emit when observers observes store$ */
  createUpdateUser(user: UserResult): Observable<UserResult> {
    const userCmd: UserCommand = { ...user };
    const response$ = this.httpClient.post<UserResult>(`${this.apiEndPoint}/user/create`, userCmd);
    this.clear();
    return response$.pipe(tap((result) => this.add(result)));
  }

  /**
   * TODO: For now, all the getters are not used. We get the user from the authService so 
   * maybe we don't need them.
   * @param email 
   
   */
  getUserFromEmail(email: string): Observable<any> {
    return this.httpClient.get(`${this.apiEndPoint}/user/getByEmail/${email}`);
  }

  getUserFromId(userId: string): Observable<any> {
    return this.httpClient.get(`${this.apiEndPoint}/user/getById/${userId}`);
  }

  /**
   *
   * @param email TODO: if an email is provided, get from remote location. Maybe user
   * exists in the system.
   */
  getUserFromCache(email?: string) {
    return this.getAll().pipe(map((users) => (users?.length > 0 ? users[0] : null)));
  }
}
