import { HttpClientModule } from '@angular/common/http';
import '@angular/compiler'; // Needed because we use Ionic and it is not 100% working with angular 9
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppShellModule } from '@skare/fouly/pwa/app-shell';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    AppShellModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
