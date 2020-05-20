import { async, TestBed } from '@angular/core/testing';
import { StoreDetailModule } from './store-detail.module';

describe('StoreDetailModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(StoreDetailModule).toBeDefined();
  });
});
