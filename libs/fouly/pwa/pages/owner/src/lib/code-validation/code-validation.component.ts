import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { IonButton, IonInput } from '@ionic/angular';

// TODO. Faire de ce component de validation une composant partagée, au besoin.
@Component({
  selector: 'fouly-code-validation',
  templateUrl: 'code-validation.component.html',
  styleUrls: ['code-validation.component.scss']
})
export class CodeValidationComponent implements OnInit {
  @ViewChildren('input') inputEl: QueryList<IonInput>;
  @ViewChild('verifyBtn') verifyBtn: IonButton;
  @ViewChild('hidden') hidden: IonInput;
  codeForm = new FormArray([]);
  private cursor = 0;
  private hasFocusYet = false;
  constructor() {
    Array.from(Array(6)).forEach(() => this.codeForm.push(new FormControl()));
  }

  ionViewDidEnter(): void {
    // setTimeout(() => this.inputEl.first.setFocus(), 500); // todo: fonctionne pas a tout coup.
  }

  ngOnInit() {}

  onFocus(idx) {
    if (!this.hasFocusYet) {
      this.hasFocusYet = true;
      this.inputEl.first.setFocus();
    } else {
      if (idx < this.cursor) {
        this.cursor = idx;
      }
    }
  }

  isDisabled() {
    return this.cursor < 6;
  }

  inputChange() {
    this.cursor += 1;
    if (this.cursor > 5) {
      // will loose focus since its hidden. I wanted to focus on the button but seems it is not possible on mobile and not supported with ion-button
      this.hidden.setFocus();
      return;
    }
    this.inputEl.map((item) => item)[this.cursor].setFocus();
  }

  submit(value) {
    console.log(value);
  }
}
