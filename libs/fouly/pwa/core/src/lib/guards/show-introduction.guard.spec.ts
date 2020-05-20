import { TestBed } from '@angular/core/testing';

import { ShowIntroductionGuard } from './show-introduction.guard';

describe('ShowIntroductionGuard', () => {
  let guard: ShowIntroductionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ShowIntroductionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
