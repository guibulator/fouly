import { async, TestBed } from '@angular/core/testing';
import { PlaceSearchModule } from './place-search.module';

describe('PlaceSearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlaceSearchModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PlaceSearchModule).toBeDefined();
  });
});
