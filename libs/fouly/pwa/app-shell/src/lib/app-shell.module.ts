import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AuthInterceptor, Error500Interceptor } from '@skare/fouly/pwa/core';
import { SocialLoginModule } from 'angularx-social-login';
import { ShellRoutingModule } from './app-shell-routing.module';
import { Error404Component } from './errors/404/error-404.component';
import { Error500Component } from './errors/500/error-500.component';
import { ShellComponent } from './shell/shell.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ShellRoutingModule,
    SocialLoginModule
  ],
  declarations: [ShellComponent, Error404Component, Error500Component],
  exports: [ShellComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: Error500Interceptor, multi: true }
  ]
})
export class AppShellModule {}
