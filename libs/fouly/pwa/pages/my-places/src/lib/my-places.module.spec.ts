import { async, TestBed } from '@angular/core/testing';
import { MyPlacesModule } from './my-places.module';

describe('MyPlacesModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MyPlacesModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(MyPlacesModule).toBeDefined();
  });
});
