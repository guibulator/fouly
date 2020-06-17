import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContributeCommand } from '@skare/fouly/data';
import { ConfigService } from '../modules/config/config.service';
@Injectable({ providedIn: 'root' })
export class ContributeStoreService {
  constructor(private httpClient: HttpClient, private configService: ConfigService) {}

  // todo: retrieve contributions in order to show as profile

  contribute(cmd: ContributeCommand) {
    return this.httpClient.post<ContributeCommand>(`${this.configService.apiUrl}/contribute`, cmd);
  }
}
