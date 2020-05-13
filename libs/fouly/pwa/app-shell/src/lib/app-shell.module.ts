import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { ShellComponent } from './shell/shell.component';
import { ShellModule } from './shell/shell.module';
@NgModule({
  imports: [CommonModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), ShellModule],
  declarations: [ShellComponent],
  exports: [ShellComponent]
})
export class AppShellModule {}
