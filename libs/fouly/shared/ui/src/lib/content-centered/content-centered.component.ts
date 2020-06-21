import { Component, Input, OnInit } from '@angular/core';
/**
 * Hide grid setup for common use case of centering a grid with different with for screen larger than size Lg
 * see https://ionicframework.com/docs/layout/grid
 */
@Component({
  selector: 'fouly-content-centered',
  template: `
    <ion-grid fixed="true">
      <ion-row class="ion-justify-content-center">
        <ion-col [sizeLg]="sizeLg" [sizeMd]="sizeMd" size="12">
          <ng-content></ng-content>
        </ion-col>
      </ion-row>
      <ion-grid> </ion-grid
    ></ion-grid>
  `
})
export class FoulyContentCenteredComponent implements OnInit {
  constructor() {}
  @Input() sizeLg = 6;
  @Input() sizeMd = 8;
  ngOnInit() {}
}
