import { TestBed } from '@angular/core/testing';

import { CheckIntroductionService } from './check-introduction.service';

describe('CheckIntroductionService', () => {
  let service: CheckIntroductionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckIntroductionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
