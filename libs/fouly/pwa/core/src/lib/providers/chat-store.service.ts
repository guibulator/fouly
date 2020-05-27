import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Msg } from '../models/msg';

@Injectable({ providedIn: 'root' })
export class ChatStoreService {
  private readonly _loading = new BehaviorSubject<boolean>(false);
  constructor(private httpClient: HttpClient) {}

  getMsgHistory(placeId: string): Observable<Msg[]> {
    this._loading.next(true);
    return this.httpClient
      .get<Msg[]>(`api/chat/${placeId}`)
      .pipe(finalize(() => this._loading.next(false)));
  }

  saveNewMsg(msgToSave: Msg): Observable<any> {
    this._loading.next(true);
    return this.httpClient
      .post(`api/chat`, msgToSave, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .pipe(finalize(() => this._loading.next(false)));
  }
}
