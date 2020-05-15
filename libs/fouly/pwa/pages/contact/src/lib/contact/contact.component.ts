import { Component } from '@angular/core';
import { ContactService } from '../contact.service';

@Component({
  selector: 'fouly-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private contactService: ContactService;

  constructor(contactservice: ContactService) {
    this.contactService = contactservice;
  }
  submitted = false;
  message = {
    subject: '',
    detail: ''
  };

  submit() {
    this.contactService
      .sendMail(JSON.stringify(this.message))
      .subscribe((x) => (this.submitted = true));
  }
}
