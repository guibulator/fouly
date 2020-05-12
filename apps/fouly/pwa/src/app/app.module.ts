import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import '@angular/compiler'; // Needed because we use Ionic and it is not 100% working with angular 9
import { AppShellModule } from '@skare/fouly/pwa/app-shell';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    AppShellModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
