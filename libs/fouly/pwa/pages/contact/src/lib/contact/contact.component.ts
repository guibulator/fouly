import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ContactService } from '../contact.service';

@Component({
  selector: 'fouly-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  commentsForm: FormGroup;

  constructor(
    private contactService: ContactService,
    private formBuilder: FormBuilder,
    private readonly translate: TranslateService
  ) {
    this.commentsForm = this.formBuilder.group({
      subject: '',
      detail: ''
    });
  }

  submitted = false;
  disabled = true;

  ngOnInit() {
    this.subscriptions.add(
      this.commentsForm.valueChanges.subscribe(() => {
        this.disabled = false;
        this.submitted = false;
      })
    );

    this.subscriptions.add(
      this.translate.store.onLangChange.subscribe((lang) => {
        this.translate.use(lang.lang);
      })
    );

    this.translate.use(this.translate.store.currentLang);
  }

  submit(formData: any) {
    this.disabled = true;
    this.contactService.sendMail(formData).subscribe(() => {
      this.submitted = true;
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
