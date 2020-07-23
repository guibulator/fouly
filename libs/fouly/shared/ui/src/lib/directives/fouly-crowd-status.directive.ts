import { Directive, HostBinding, Input, OnChanges } from '@angular/core';

@Directive({ selector: '[foulyCrowdStatus]' })
export class FoulyCrowdStatusDirective implements OnChanges {
  @Input('foulyCrowdStatus') status: string;
  @HostBinding('style.color') color: string;
  constructor() {}

  ngOnChanges() {
    this.color = this.getColorFromStatus(this.status);
  }

  private getColorFromStatus(status: string) {
    if (status === 'low') {
      return 'green';
    } else if (status === 'medium') {
      return 'yellow';
    } else if (status === 'high') {
      return 'red';
    } else {
      return 'white';
    }
  }
}
