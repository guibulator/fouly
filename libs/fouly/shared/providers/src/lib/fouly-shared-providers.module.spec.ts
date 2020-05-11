import { async, TestBed } from '@angular/core/testing';
import { FoulySharedProvidersModule } from './fouly-shared-providers.module';

describe('FoulySharedProvidersModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FoulySharedProvidersModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FoulySharedProvidersModule).toBeDefined();
  });
});
