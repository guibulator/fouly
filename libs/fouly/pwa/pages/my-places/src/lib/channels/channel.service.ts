import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatStoreService, Msg } from '@skare/fouly/pwa/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  //Todo : put url in config.
  azureFctSignalRConnectionBaseUrl =
    'https://skaresendgridapi.azurewebsites.net/api/getSignalrConnection?code=ef4Ob9BY2cvt6thdx4L5nE1lHppzSjU1OEsJTA3tMd3qVKp8Mtf1nQ==';

  constructor(private http: HttpClient, private chatService: ChatStoreService) {}

  getConnection() {
    return this.http.get(this.azureFctSignalRConnectionBaseUrl, {
      headers: {},
      responseType: 'text'
    });
  }

  getLastMsg(placeId: string): Observable<Msg[]> {
    return this.chatService.getMsgHistory(placeId);
  }

  saveNewMsg(newMsg: Msg) {
    return this.chatService.saveNewMsg(newMsg);
  }
}
