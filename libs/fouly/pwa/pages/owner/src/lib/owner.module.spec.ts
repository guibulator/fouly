import { async, TestBed } from '@angular/core/testing';
import { OwnerModule } from './owner.module';

describe('OwnerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OwnerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(OwnerModule).toBeDefined();
  });
});
