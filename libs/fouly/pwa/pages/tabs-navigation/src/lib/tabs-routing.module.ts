import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'tabs',
        component: TabsComponent,
        children: [
          {
            path: 'map',
            loadChildren: () =>
              import('@skare/fouly/pwa/pages/map').then((module) => module.MapModule)
          },
          {
            path: 'my-places',
            loadChildren: () =>
              import('@skare/fouly/pwa/pages/my-places').then((module) => module.MyPlacesModule)
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class TabsRoutingModule {}
