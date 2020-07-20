import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowIntroductionGuard, WithDelayPreloadingStrategy } from '@skare/fouly/pwa/core';
import { Error404Component } from './errors/404/error-404.component';
import { Error500Component } from './errors/500/error-500.component';
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
          path: 'identity',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/login').then((module) => module.LoginModule)
        },
        {
          path: 'app/tabs/my-places',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/my-places').then((module) => module.MyPlacesModule)
        },
        {
          path: 'contribute',
          loadChildren: () =>
            import('@skare/fouly/pwa/pages/contribute').then((module) => module.ContributeModule)
        },
        { path: 'error', component: Error500Component },

        { path: '**', component: Error404Component }
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
