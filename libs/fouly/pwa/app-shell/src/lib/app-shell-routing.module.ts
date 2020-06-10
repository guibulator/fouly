import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowIntroductionGuard, WithDelayPreloadingStrategy } from '@skare/fouly/pwa/core';
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
        // {
        //   path: 'support',
        //   loadChildren: () =>
        //     import('@skare/fouly/pwa/pages/support').then((module) => module.SupportModule)
        // },
        {
          path: 'app',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/tabs-navigation').then(
              (module) => module.TabsNavigationModule
            ),
          data: { preload: true }
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
          path: 'login',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/login').then((module) => module.LoginModule)
        },
        {
          path: 'app/tabs/my-places',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/my-places').then((module) => module.MyPlacesModule)
        },
        { path: '**', redirectTo: '' }
      ],
      {
        initialNavigation: 'enabled',
        enableTracing: false,
        preloadingStrategy: WithDelayPreloadingStrategy
      }
    )
  ],
  exports: [RouterModule],
  providers: [WithDelayPreloadingStrategy]
})
export class ShellRoutingModule {}
