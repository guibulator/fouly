import { async, TestBed } from '@angular/core/testing';
import { ChannelModule } from './channel.module';

describe('ChannelModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ChannelModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ChannelModule).toBeDefined();
  });
});
