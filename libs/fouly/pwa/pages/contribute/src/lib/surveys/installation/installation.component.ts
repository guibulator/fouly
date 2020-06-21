import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ContributeGlobalAppreciation } from '@skare/fouly/data';

@Component({
  selector: 'fouly-survey-installation',
  templateUrl: 'installation.component.html'
})
export class InstallationComponent implements OnInit {
  @Output() userChoice = new EventEmitter<ContributeGlobalAppreciation>();
  constructor() {}

  ngOnInit() {}
  clicked(value: ContributeGlobalAppreciation) {
    this.userChoice.emit(value);
  }
}
