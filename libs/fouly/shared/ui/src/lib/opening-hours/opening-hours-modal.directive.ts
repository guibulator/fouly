import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FoulyOpeningHoursComponent } from './opening-hours.component';

/**
 * Displays a modal dialog with the business hours, already translated.
 */
@Directive({
  selector: '[foulyOpeningHours]'
})
export class FoulyOpeningHoursModalDirective implements OnInit {
  @Input('foulyOpeningHours') weekDays: string[];
  constructor(private modalController: ModalController) {}

  @HostListener('click')
  openModal() {
    from(
      this.modalController.create({
        component: FoulyOpeningHoursComponent,
        componentProps: { weekDays: this.weekDays },
        swipeToClose: true
      })
    )
      .pipe(switchMap((modal) => modal.present()))
      .subscribe();
  }
  ngOnInit() {}
}
