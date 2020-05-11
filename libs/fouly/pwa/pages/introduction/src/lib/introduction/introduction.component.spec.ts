import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IntroductionComponentPage } from './introduction.component';

describe('IntroductionComponent', () => {
  let component: IntroductionComponentPage;
  let fixture: ComponentFixture<IntroductionComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroductionComponentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IntroductionComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
