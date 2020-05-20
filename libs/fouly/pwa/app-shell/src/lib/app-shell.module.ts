import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ShellRoutingModule } from './app-shell-routing.module';
import { ShellComponent } from './shell/shell.component';

@NgModule({
  imports: [CommonModule, IonicModule.forRoot(), ShellRoutingModule],
  declarations: [ShellComponent],
  exports: [ShellComponent]
})
export class AppShellModule {}
