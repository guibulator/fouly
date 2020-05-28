import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@skare/fouly/pwa/core';
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  sendMail(msg: any) {
    const apiEndPoint = this.configService.apiUrl;
    return this.http.post(`${apiEndPoint}/mail`, msg);
  }
}
