import { Directive, HostBinding, Input, OnChanges } from '@angular/core';

@Directive({ selector: '[foulyCrowdStatus]' })
export class FoulyCrowdStatusDirective implements OnChanges {
  @Input('foulyCrowdStatus') status: string;
  @HostBinding('attr.color') color: string;
  constructor() {}

  ngOnChanges() {
    this.color = this.getColorFromStatus(this.status);
  }

  private getColorFromStatus(status: string) {
    if (status === 'low') {
      return 'success';
    } else if (status === 'medium') {
      return 'warning';
    } else if (status === 'high') {
      return 'danger';
    }
  }
}
