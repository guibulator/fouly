import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterBusinessMailCommand } from '@skare/fouly/data';
import { retry } from 'rxjs/operators';
import { ConfigService } from '../../modules/config/config.service';
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiEndPoint: string;
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiEndPoint = this.configService.apiUrl;
  }

  sendMail(msg: any) {
    //TODO: change endpoint name
    return this.http.post(`${this.apiEndPoint}/mail/contactForm`, msg).pipe(retry(3));
  }

  registerBusiness(msg: RegisterBusinessMailCommand) {
    return this.http.post(`${this.apiEndPoint}/mail/registerBusinessForm`, msg).pipe(retry(3));
  }
}
