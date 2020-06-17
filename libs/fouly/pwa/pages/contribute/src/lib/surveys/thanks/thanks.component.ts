import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'fouly-survey-thanks',
  templateUrl: 'thanks.component.html'
})
export class ThanksComponent implements OnInit {
  @Output() userChoice = new EventEmitter();
  constructor() {}

  ngOnInit() {}
  clicked() {
    this.userChoice.emit();
  }
}
