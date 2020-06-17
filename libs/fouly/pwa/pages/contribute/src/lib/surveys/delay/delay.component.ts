import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ContributeSpeed } from '@skare/fouly/data';

@Component({
  selector: 'fouly-survey-delay',
  templateUrl: 'delay.component.html'
})
export class DelayComponent implements OnInit {
  @Output() userChoice = new EventEmitter<ContributeSpeed>();
  constructor() {}
  clicked(contributeSpeed: ContributeSpeed) {
    this.userChoice.emit(contributeSpeed);
  }
  ngOnInit() {}
}
