import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatMessageCommand, ChatMessageResult } from '@skare/fouly/data';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ConfigService } from '../../modules/config/config.service';

@Injectable({ providedIn: 'root' })
export class ChatStoreService {
  private readonly _loading = new BehaviorSubject<boolean>(false);
  private readonly apiEndPoint: string;
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.apiEndPoint = this.configService.apiUrl;
  }

  getMsgHistory(placeId: string): Observable<ChatMessageResult[]> {
    this._loading.next(true);
    return this.httpClient
      .get<ChatMessageResult[]>(`${this.apiEndPoint}/chat/history/${placeId}`)
      .pipe(finalize(() => this._loading.next(false)));
  }

  postNewMsg(msgToSave: ChatMessageCommand) {
    this._loading.next(true);
    return this.httpClient
      .post(`${this.apiEndPoint}/chat/postNewMsg`, msgToSave)
      .pipe(finalize(() => this._loading.next(false)))
      .subscribe();
  }

  getConnectionSignalR(): Observable<any> {
    this._loading.next(true);
    return this.httpClient
      .get(`${this.apiEndPoint}/chat/signalR/infoConnection`)
      .pipe(finalize(() => this._loading.next(false)));
  }
}
