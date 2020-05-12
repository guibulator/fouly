import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellComponent } from './shell/shell.component';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    RouterModule.forRoot(
      [
        {
          path: 'introduction',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/introduction').then(
              (module) => module.IntroductionModule
            ),
        },
        {
          path: 'map',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/map').then((module) => module.MapModule),
        },
        {
          path: 'my-places',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/my-places').then((module) => module.MyPlacesModule),
        },
        {
          path: 'support',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/support').then((module) => module.SupportModule),
        },
      ],
      { initialNavigation: 'enabled' }
    ),
  ],
  declarations: [ShellComponent],
  exports: [ShellComponent],
})
export class AppShellModule {}
