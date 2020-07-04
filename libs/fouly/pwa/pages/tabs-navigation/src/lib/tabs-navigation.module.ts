import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TabsRoutingModule } from './tabs-routing.module';
import { TabsComponent } from './tabs/tabs.component';
@NgModule({
  imports: [CommonModule, TabsRoutingModule, TranslateModule, IonicModule],
  declarations: [TabsComponent]
})
export class TabsNavigationModule {}
