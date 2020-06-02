import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowIntroductionGuard } from '@skare/fouly/pwa/core';
const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          redirectTo: '/introduction',
          pathMatch: 'full'
        },

        {
          path: 'support',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/support').then((module) => module.SupportModule)
        },
        {
          path: 'app',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/tabs-navigation').then(
              (module) => module.TabsNavigationModule
            )
        },
        {
          path: 'introduction',
          canActivate: [ShowIntroductionGuard],
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/introduction').then(
              (module) => module.IntroductionModule
            )
        },
        {
          path: 'contact',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/contact').then((module) => module.ContactModule)
        },
        {
          path: 'app/tabs/myplaces',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/my-places').then((module) => module.MyPlacesModule)
        },
        { path: '**', redirectTo: '' }
      ],
      { initialNavigation: 'enabled', enableTracing: false }
    )
  ],
  exports: [RouterModule]
})
export class ShellRoutingModule {}
