import { async, TestBed } from '@angular/core/testing';
import { ContributeModule } from './contribute.module';

describe('ContributeModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ContributeModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ContributeModule).toBeDefined();
  });
});
