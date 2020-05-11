import { Component, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, IonSlides, AlertController } from '@ionic/angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'fouly-page-introduction',
  templateUrl: 'introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponentPage {
  showSkip = true;
 private pwaInstallDeferred:any;
  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage,
    private alertCtrl:AlertController
  ) {}

  startApp() {
    this.router
      .navigateByUrl('/app/tabs/map', { replaceUrl: true })
      .then(() => this.storage.set('fouly_did_introduction', true));
  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }

  ionViewWillEnter() {
    this.storage.get('ion_did_tutorial').then(res => {
      if (res === true) {
        this.router.navigateByUrl('/app/tabs/map', { replaceUrl: true });
      }
    });

    this.menu.enable(false);
  }
  @HostListener("window:beforeinstallprompt", ["$event"])
  async pwaInstallPrompt($event) {
    // TODO: See https://web.dev/promote-install/ for ideas
    // TODO: make this a shared feature as this event can be called on any route
    $event.preventDefault();
    this.pwaInstallDeferred = $event;
  }

  private async showInstallAlert() {
    const alert = await this.alertCtrl.create({
      header: "Version mobile disponible!",
      message:
        "Désirez-vous installer l'application pour obtenir une meilleure expérience utilisateur ?",
      buttons: [
        {
          text: "Non merci",
        },
        {
          text: "Installer",
          handler: () => {
            this.pwaInstallDeferred.prompt();
            this.pwaInstallDeferred.userChoice.then((choiceResult) => {
              if (choiceResult.outcome === "accepted") {
                console.log("User accepted the install prompt");
              } else {
                console.log("User dismissed the install prompt");
              }
            });
          },
        },
      ],
    });
    return await alert.present();
  }

  async ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
    // ask the user if he wants to install the app
    if (this.pwaInstallDeferred){
      await this.showInstallAlert();
    }
   
  }
}
