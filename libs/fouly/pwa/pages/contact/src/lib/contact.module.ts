import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FoulyUiModule } from '@skare/fouly/shared/ui';
import { ContactComponent } from './contact/contact.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/contact-', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    FoulyUiModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: ContactComponent }])
  ],
  declarations: [ContactComponent]
})
export class ContactModule {}
