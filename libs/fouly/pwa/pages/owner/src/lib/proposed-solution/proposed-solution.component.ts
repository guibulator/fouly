import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fouly-owner-proposed-solution',
  templateUrl: 'proposed-solution.component.html',
  styleUrls: ['proposed-solution.component.scss']
})
export class OwnerProposedSolutionComponent implements OnInit {
  constructor(private translate: TranslateService, private activatedRoute: ActivatedRoute) {}
  private subscriptions = new Subscription();
  placeName: string;
  ngOnInit() {
    this.subscriptions.add(
      this.translate.store.onLangChange.subscribe((lang) => {
        this.translate.use(lang.lang);
      })
    );

    this.translate.use(this.translate.store.currentLang);
    this.placeName = this.activatedRoute.snapshot.params['placeName'];
  }
}
