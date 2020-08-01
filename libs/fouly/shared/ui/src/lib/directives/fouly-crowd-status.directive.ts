import { Directive, HostBinding, Input, OnChanges, OnDestroy } from '@angular/core';
import { UserPreferenceService } from '@skare/fouly/pwa/core';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Directive({ selector: '[foulyCrowdStatus]' })
export class FoulyCrowdStatusDirective implements OnChanges, OnDestroy {
  @Input('foulyCrowdStatus') status: string;
  @HostBinding('style.color') color: string;
  private subscription = new Subscription();
  constructor(private userPrefService: UserPreferenceService) {
    this.subscription.add(this.userPrefService.store$.subscribe(() => this.ngOnChanges()));
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges() {
    this.getColorFromStatus(this.status).subscribe((color) => (this.color = color));
  }

  private getColorFromStatus(status: string) {
    return this.userPrefService.store$.pipe(
      take(1),
      map(({ darkTheme }) => {
        if (status === 'low') {
          return 'green';
        } else if (status === 'medium') {
          return 'orange';
        } else if (status === 'high') {
          return 'red';
        } else {
          return darkTheme ? 'white' : 'black';
        }
      })
    );
  }
}
