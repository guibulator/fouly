import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from, Subscription } from 'rxjs';
import { finalize, flatMap, retry, tap } from 'rxjs/operators';
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
    private readonly toastController: ToastController,
    private translateService: TranslateService
  ) {
    this.commentsForm = this.formBuilder.group({
      subject: '',
      message: '',
      fromEmail: new FormControl('', Validators.compose([Validators.required, Validators.email]))
    });
  }

  submitted = false;
  disabled = true;
  sending = false;

  ngOnInit() {
    this.subscriptions.add(
      this.commentsForm.valueChanges.subscribe(() => {
        this.disabled = this.commentsForm.invalid;
        this.submitted = false;
      })
    );
  }

  submit(formData: any) {
    this.disabled = true;
    this.sending = true;
    this.contactService
      .sendMail(formData)
      .pipe(
        retry(3),
        flatMap(() =>
          from(
            this.toastController.create({
              message: this.translateService.instant('page.contact.thanks'),
              duration: 3000,
              color: 'tertiary',
              position: 'middle'
            })
          )
        ),
        tap((toast) => toast.present()),
        finalize(() => (this.sending = false))
      )
      .subscribe(() => {
        this.disabled = false;
        this.commentsForm.reset();
        this.submitted = true;
      });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
