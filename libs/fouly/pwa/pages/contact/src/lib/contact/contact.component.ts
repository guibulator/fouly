import { Component } from '@angular/core';
import { Form } from '@angular/forms';
import {
  AzureNotificationHubsService,
  Notification,
  Registration
} from '@skare/fouly/shared/providers';
@Component({
  selector: 'fouly-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private eventList: (Registration | Notification)[] = [];

  constructor(public pushService: AzureNotificationHubsService) {
    this.eventList = this.pushService.pushEvents;
  }
  submitted = false;
  message = {
    subject: '',
    detail: ''
  };

  submit(submitForm: Form) {}
}
