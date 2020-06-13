import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

/**
 * Displays a modal dialog with the business hours, already translated.
 */
@Component({
  selector: 'fouly-opening-hours',
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Horaire</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Fermer</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-list>
        <ion-item *ngFor="let i of weekDays">{{ i }} </ion-item>
      </ion-list>
      <ion-img [src]="'assets/img/svg/undraw_in_no_time_6igu.svg'"></ion-img>
    </ion-content>
  `
})
export class FoulyOpeningHoursComponent implements OnInit {
  @Input() weekDays: string[];
  // day 0 is Sunday
  // time is 24H format in local time of the place

  constructor(private modalController: ModalController) {}

  ngOnInit() {}
  dismiss() {
    this.modalController.dismiss();
  }
}
