import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient) {}

  //Todo : put url in config.
  azureFctBaseUrl =
    'https://skaresendgridapi.azurewebsites.net/api/HttpTrigger1?code=j1IIZxEna5XNfAAeHwTAJCR7aIJk/LuImKGPMZG7Yj5B407wra8rDg==';

  sendMail(msg: any) {
    return this.http.post(this.azureFctBaseUrl, msg, {
      headers: {
        'Access-Control-Allow-Origin': this.azureFctBaseUrl,
        'Content-Type': 'application/json'
      },

      responseType: 'text'
    });
  }
}
