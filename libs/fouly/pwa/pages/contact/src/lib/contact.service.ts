import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient) {}

  azureFctBaseUrl =
    'https://skaresendgridapi.azurewebsites.net/api/HttpTrigger1?code=j1IIZxEna5XNfAAeHwTAJCR7aIJk/LuImKGPMZG7Yj5B407wra8rDg==';

  sendMail(msg: string) {
    return this.http
      .post(this.azureFctBaseUrl, msg, {
        headers: { 'Access-Control-Allow-Origin': this.azureFctBaseUrl },
        responseType: 'text'
      })
      .pipe(
        tap(
          (data) => console.log(data),
          (error) => console.log(error)
        )
      );
  }
}
