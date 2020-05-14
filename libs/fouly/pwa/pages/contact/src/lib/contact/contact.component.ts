import { Component } from '@angular/core';
import { Form } from '@angular/forms';

@Component({
  selector: 'fouly-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  constructor() {}
  submitted = false;
  message = {
    subject: '',
    detail: ''
  };

  submit(submitForm: Form) {}
}
