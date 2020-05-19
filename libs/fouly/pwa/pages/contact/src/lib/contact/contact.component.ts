import { Component, OnInit } from '@angular/core';
import {
  AzureNotificationHubsService,
  EventType,
  Notification,
  Registration
} from '@skare/fouly/shared/providers';

@Component({
  selector: 'fouly-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  constructor(public pushService: AzureNotificationHubsService) {
    this.eventList = this.pushService.pushEvents;
  }

  private eventList: (Registration | Notification)[] = [];
  private event: Registration = {
    // initialize as empty object just to start, otherwise
    // the .html page will crash on load.
    type: EventType.registration,
    title: '',
    registrationId: '',
    azureRegId: '',
    received: new Date(Date.now())
  };

  submitted = false;
  message = {
    subject: '',
    detail: ''
  };

  submit() {}

  ngOnInit() {
    debugger;
    console.log('NotificationEventPage: ngOnInit()');
    // Get the index from the Query String
    const idx = 1;
    // Grab that item from the event list
    this.event = this.pushService.pushEvents[idx] as Registration;
  }
}
