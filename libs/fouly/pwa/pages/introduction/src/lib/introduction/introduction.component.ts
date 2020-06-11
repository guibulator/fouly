import { Component, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSlides, MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
@Component({
  selector: 'fouly-page-introduction',
  templateUrl: 'introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponentPage {
  private pwaInstallDeferred: any;
  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage,
    private alertCtrl: AlertController
  ) {}

  startApp() {
    from(this.router.navigateByUrl('/app/tabs/map', { replaceUrl: true }))
      .pipe()
      .subscribe(() => this.storage.set('fouly_did_introduction', true));
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }
  @HostListener('window:beforeinstallprompt', ['$event'])
  async pwaInstallPrompt($event) {
    // TODO: See https://web.dev/promote-install/ for ideas
    // TODO: make this a shared feature as this event can be called on any route
    $event.preventDefault();
    this.pwaInstallDeferred = $event;
  }

  private async showInstallAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Version mobile disponible!',
      message:
        "Désirez-vous installer l'application pour obtenir une meilleure expérience utilisateur ?",
      buttons: [
        {
          text: 'Non merci'
        },
        {
          text: 'Installer',
          handler: () => {
            this.pwaInstallDeferred.prompt();
            this.pwaInstallDeferred.userChoice.then((choiceResult) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
              } else {
                console.log('User dismissed the install prompt');
              }
            });
          }
        }
      ]
    });
    return await alert.present();
  }

  async ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
    // ask the user if he wants to install the app
    if (this.pwaInstallDeferred) {
      await this.showInstallAlert();
    }
  }
}
