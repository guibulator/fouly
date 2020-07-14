import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonSlides, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  ContributeCommand,
  ContributeGlobalAppreciation,
  ContributeQueueLength,
  ContributeSpeed
} from '@skare/fouly/data';
import {
  ContributeStoreService,
  LocalisationStoreService,
  UserStoreService
} from '@skare/fouly/pwa/core';
import { from, Subscription } from 'rxjs';
import { delay, flatMap, retryWhen, take, tap } from 'rxjs/operators';
@Component({
  selector: 'fouly-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.scss']
})
export class SurveyFormComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscriptions = new Subscription();
  private stepValue: number;
  private userContribution = new ContributeCommand();

  lastSlide = false;
  progression = 0;

  @ViewChild('slides') slides: IonSlides;
  @ViewChild('content') content: IonContent;

  constructor(
    private navController: NavController,
    private contributeService: ContributeStoreService,
    private userStoreService: UserStoreService,
    private activatedRoute: ActivatedRoute,
    private localisationService: LocalisationStoreService,
    private toastCtrl: ToastController,
    private translateService: TranslateService
  ) {
    this.userContribution.placeId = this.activatedRoute.snapshot.params.placeId;
    this.userContribution.time = new Date();
  }

  ngAfterViewInit(): void {
    from(this.slides.length()).subscribe((nbrSlides) => {
      this.stepValue = 1 / nbrSlides;
      this.progression = this.stepValue;
    });
  }

  ngOnInit(): void {
    this.localisationService.getPosition().subscribe((pos) => {
      this.userContribution.lng = pos?.coords?.longitude;
      this.userContribution.lat = pos?.coords?.latitude;
    });
  }
  /**
   * Fire and forget user contribution with 2 retry attempts
   */
  end() {
    this.userStoreService
      .getAll()
      .pipe(
        take(1),
        flatMap((users) => {
          if (users && users.length > 0) this.userContribution.userId = users[0].userId;
          return this.contributeService.contribute(this.userContribution);
        }),
        retryWhen((errors) =>
          errors.pipe(
            tap((error) => console.error('Error while sending your contribution')),
            delay(5000),
            take(2)
          )
        )
      )
      .subscribe();

    this.navController.back();
  }

  surveyNumberChoice(queueLength: ContributeQueueLength) {
    this.userContribution.queueLength = queueLength;
    this.slideNext();
  }

  surveyGlobalAppreciationChoice(appreciation: ContributeGlobalAppreciation) {
    this.userContribution.globalApreciation = appreciation;
    this.slideNext();
  }

  surveySpeedChoice(speed: ContributeSpeed) {
    this.userContribution.speed = speed;
    this.slideNext();
  }

  private slideNext() {
    if (this.lastSlide) {
      this.end();
      from(
        this.toastCtrl.create({
          message: this.translateService.instant('page.contribute.thanks'),
          duration: 2500,
          color: 'secondary',
          position: 'bottom'
        })
      ).subscribe((toast) => toast.present());
      return;
    }
    this.slides.slideNext();
    this.content.scrollToTop(0);
    this.progression = this.progression + this.stepValue;
    this.lastSlide = this.progression === 1;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
