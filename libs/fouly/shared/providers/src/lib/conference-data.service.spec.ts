import { TestBed } from '@angular/core/testing';

import { ConferenceDataService } from './conference-data.service';

describe('ConferenceDataService', () => {
  let service: ConferenceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConferenceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
