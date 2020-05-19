import { TestBed } from '@angular/core/testing';

import { AzureNotifHubService } from './azure-notif-hub.service';

describe('AzureNotifHubService', () => {
  let service: AzureNotifHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureNotifHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
