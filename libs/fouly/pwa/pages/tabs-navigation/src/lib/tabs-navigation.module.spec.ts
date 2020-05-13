import { async, TestBed } from '@angular/core/testing';
import { TabsNavigationModule } from './tabs-navigation.module';

describe('TabsNavigationModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TabsNavigationModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(TabsNavigationModule).toBeDefined();
  });
});
