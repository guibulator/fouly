import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  AzureNotificationHubsService,
  EventType,
  Notification,
  Registration
} from '@skare/fouly/shared/providers';
import { Subscription } from 'rxjs';
import { ContactService } from '../contact.service';

@Component({
  selector: 'fouly-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
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

  private subscr: Subscription;
  private contactService: ContactService;
  commentsForm: FormGroup;

  constructor(
    private contactservice: ContactService,
    private formBuilder: FormBuilder,
    public pushService: AzureNotificationHubsService
  ) {
    this.contactService = contactservice;
    this.eventList = this.pushService.pushEvents;
    this.commentsForm = this.formBuilder.group({
      subject: '',
      detail: ''
    });
  }

  submitted = false;
  disabled = true;

  ngOnInit() {
    this.subscr = this.commentsForm.valueChanges.subscribe(() => {
      this.disabled = false;
      this.submitted = false;
    });
    console.log('NotificationEventPage: ngOnInit()');
    // Get the index from the Query String
    const idx = 1;
    // Grab that item from the event list
    this.pushService.request();
    this.event = this.pushService.pushEvents[idx] as Registration;
  }

  submit(formData: any) {
    this.disabled = true;
    this.contactService.sendMail(formData).subscribe(() => {
      this.submitted = true;
    });
  }

  ngOnDestroy() {
    this.subscr.unsubscribe();
  }
}
