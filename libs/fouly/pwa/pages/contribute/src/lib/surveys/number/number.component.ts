import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ContributeQueueLength } from '@skare/fouly/data';

@Component({
  selector: 'fouly-survey-number',
  templateUrl: 'number.component.html'
})
export class NumberComponent implements OnInit {
  @Output() userChoice = new EventEmitter<ContributeQueueLength>();
  constructor() {}

  ngOnInit() {}
  clicked(value: ContributeQueueLength) {
    this.userChoice.emit(value);
  }
}
