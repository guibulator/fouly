import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TabsRoutingModule } from './tabs-routing.module';
import { TabsComponent } from './tabs/tabs.component';
@NgModule({
  imports: [CommonModule, TabsRoutingModule, IonicModule],
  declarations: [TabsComponent]
})
export class TabsNavigationModule {}
