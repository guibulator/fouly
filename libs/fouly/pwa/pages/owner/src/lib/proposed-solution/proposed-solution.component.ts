import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PlaceDetailsResult, RegisterBusinessMailCommand } from '@skare/fouly/data';
import { ContactService, PlaceDetailsStoreService } from '@skare/fouly/pwa/core';
import { from, Observable, Subscription } from 'rxjs';
import { flatMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'fouly-owner-proposed-solution',
  templateUrl: 'proposed-solution.component.html',
  styleUrls: ['proposed-solution.component.scss']
})
export class OwnerProposedSolutionComponent implements OnInit {
  placeDetail$: Observable<PlaceDetailsResult>;
  loading$: Observable<boolean>;
  form: FormGroup;
  disabled = true;
  submitted = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private placeDetailsStore: PlaceDetailsStoreService,
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private readonly toastController: ToastController,
    private translateService: TranslateService
  ) {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email]))
    });
  }
  private subscriptions = new Subscription();
  placeName: string;
  ngOnInit() {
    this.placeName = this.activatedRoute.snapshot.parent.params['placeName'];
    this.placeDetail$ = this.placeDetailsStore.store$;
    this.loading$ = this.placeDetailsStore.loading$;
    // TODO: we only need place address, add support of fetching only needed fields if its becoming to costly
    this.placeDetailsStore.loadPlaceId(this.activatedRoute.snapshot.parent.params['placeId']);
    this.subscriptions.add(
      this.form.valueChanges.subscribe(() => {
        this.disabled = this.form.invalid;
        this.submitted = false;
      })
    );
  }

  submit(formValue) {
    this.placeDetail$.pipe(take(1)).subscribe((placeDetail) => {
      const cmd: RegisterBusinessMailCommand = {
        businessName: this.placeName,
        placeId: placeDetail.place_id,
        registeredAddress: placeDetail.adr_address,
        email: formValue.email,
        lastName: formValue.lastName,
        firstName: formValue.firstName
      };

      this.contactService
        .registerBusiness(cmd)
        .pipe(
          flatMap(() =>
            from(
              this.toastController.create({
                message: this.translateService.instant(
                  'page.owner.childRoute.solution.successRegistration'
                ),
                duration: 3000,
                color: 'tertiary',
                position: 'middle'
              })
            )
          ),
          tap((toast) => toast.present())
        )
        .subscribe(() => {
          this.disabled = false;
          this.form.reset();
          this.submitted = true;
        });
    });
  }
}
