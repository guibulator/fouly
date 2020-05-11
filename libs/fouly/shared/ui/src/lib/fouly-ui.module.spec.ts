import { async, TestBed } from '@angular/core/testing';
import { FoulyUiModule } from './fouly-ui.module';

describe('FoulyUiModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FoulyUiModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FoulyUiModule).toBeDefined();
  });
});
