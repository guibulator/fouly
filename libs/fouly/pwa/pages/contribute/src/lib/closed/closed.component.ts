import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fouly-contribute-closed',
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'page.contribute.closed.titleToolbar' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-card>
        <ion-img [src]="'assets/img/svg/undraw_in_no_time_6igu.svg'"></ion-img>
        <ion-card-header>
          <ion-card-title class="ion-text-center">{{
            'page.contribute.closed.title' | translate
          }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          {{ 'page.contribute.closed.content' | translate }}
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})
export class ClosedComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
