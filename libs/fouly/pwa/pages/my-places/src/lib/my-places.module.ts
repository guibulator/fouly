import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChannelsComponent } from './channels/channels.component';
import { FavoritesComponent } from './favorites/favorites.component';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: FavoritesComponent }])
  ],
  declarations: [ChannelsComponent, FavoritesComponent]
})
export class MyPlacesModule {}
