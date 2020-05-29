import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatMessageCommand, ChatMessageResult } from '@skare/fouly/data';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChatStoreService {
  private readonly _loading = new BehaviorSubject<boolean>(false);
  constructor(private httpClient: HttpClient) {}

  getMsgHistory(placeId: string): Observable<ChatMessageResult[]> {
    this._loading.next(true);
    return this.httpClient
      .get<ChatMessageResult[]>(`api/chat/${placeId}`)
      .pipe(finalize(() => this._loading.next(false)));
  }

  saveNewMsg(msgToSave: ChatMessageCommand): Observable<any> {
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
