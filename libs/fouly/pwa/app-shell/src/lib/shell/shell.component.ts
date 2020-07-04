import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService, UserPreferenceService } from '@skare/fouly/pwa/core';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

declare let gtag: Function;
@Component({
  selector: 'fouly-app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShellComponent implements OnInit, OnDestroy {
  appPages = [
    {
      title: 'appshell.favorites',
      url: '/app/tabs/my-places',
      icon: 'star'
    },
    {
      title: 'appshell.map',
      url: '/app/tabs/map',
      icon: 'location'
    },
    {
      title: 'appshell.contactUs',
      url: '/contact',
      icon: 'mail'
    }
  ];

  loggedIn = false;
  dark = false;
  languageForm: FormGroup;
  private subcribes = new Subscription();
  version: string;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private readonly translate: TranslateService,
    private readonly config: ConfigService,
    private readonly userPreference: UserPreferenceService
  ) {
    this.initializeApp();

    this.subcribes.add(
      this.router.events
        .pipe(
          filter((e) => e instanceof NavigationEnd),
          tap((e) =>
            gtag('config', 'G-E8SJZBBV49', {
              page_path: e['urlAfterRedirects']
            })
          )
        )
        .subscribe()
    );

    this.version = this.config.version;
  }

  ngOnDestroy(): void {
    this.subcribes.unsubscribe();
  }

  async ngOnInit() {
    const lang = await this.userPreference.GetLanguage();

    this.subcribes.add(
      this.swUpdate.available.subscribe(async (res) => {
        const toast = await this.toastCtrl.create({
          message: 'Mise à jour disponible!',
          position: 'bottom',
          buttons: [
            {
              role: 'cancel',
              text: 'Rafraichir'
            }
          ]
        });

        await toast.present();

        toast
          .onDidDismiss()
          .then(() => this.swUpdate.activateUpdate())
          .then(() => window.location.reload());
      })
    );

    this.languageForm = this.formBuilder.group({
      language: lang
    });

    this.translate.setDefaultLang(lang);
    this.translate.use(lang);

    this.subcribes.add(
      this.languageForm.controls['language'].valueChanges.subscribe((value) => {
        this.userPreference.SetLanguage(value);
        this.translate.use(value);
      })
    );
  }

  initializeApp() {
    this.platform.ready().then(() => {});
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('fouly_did_introduction', false);
    this.router.navigateByUrl('/introduction');
  }

  gotoLink(url: string) {
    this.router.navigateByUrl(url);
  }
}
