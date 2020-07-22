import { Directive, HostBinding } from '@angular/core';

@Directive({ selector: '[foulyCrowdIcon]' })
export class FoulyCrowdIconDirective {
  constructor() {
    setTimeout(() => {
      this.color = 'danger';
    }, 5000);
  }

  @HostBinding('attr.color') color: string;
}
