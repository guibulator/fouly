import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@skare/fouly/pwa/core';
@Component({
  selector: 'fouly-measures',
  templateUrl: 'measures.component.html'
})
export class MeasuresComponent implements OnInit {
  constructor(private toast: ToastService, private translate: TranslateService) {}

  ngOnInit() {}

  proposeMeasure() {
    this.toast.show(this.translate.instant('page.storeDetail.measures.na'));
  }
}
