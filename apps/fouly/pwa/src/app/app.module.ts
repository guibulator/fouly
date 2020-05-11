import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import "@angular/compiler" // Needed because we use Ionic and it is not 100% working with angular 9
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        {
          path: 'introduction',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/introduction').then(
              module => module.IntroductionModule
            )
        },
        {
          path: 'map',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/map').then(
              module => module.MapModule
            )
        },
        {
          path: 'my-places',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/my-places').then(
              module => module.MyPlacesModule
            )
        },
        {
          path: 'support',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/support').then(
              module => module.SupportModule
            )
        }
      ],
      { initialNavigation: 'enabled' }
    ),
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
