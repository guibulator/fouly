import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContactService } from '../contact.service';

@Component({
  selector: 'fouly-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  private subscr: Subscription;
  private contactService: ContactService;
  commentsForm: FormGroup;

  constructor(private contactservice: ContactService, private formBuilder: FormBuilder) {
    this.contactService = contactservice;
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
