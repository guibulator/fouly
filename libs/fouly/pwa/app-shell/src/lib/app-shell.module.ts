import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SocialLoginModule } from 'angularx-social-login';
import { ShellRoutingModule } from './app-shell-routing.module';
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
  declarations: [ShellComponent],
  exports: [ShellComponent]
})
export class AppShellModule {}
