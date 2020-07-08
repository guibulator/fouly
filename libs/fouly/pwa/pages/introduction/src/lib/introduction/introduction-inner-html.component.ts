import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
/**
 * This component could propably be made generic for all the innerHtml styling needs. Also,
 * I used a component but would rather prefer a structural directive to keep the same
 * flow as with innerHtml. i.e. <div class="content" *foulyInnerHtml="'page.withHtml' | translate"></div>
 */
@Component({
  selector: 'fouly-intro-inner-html',
  styles: [
    `
      .fouly-title-introduction {
        color: var(--ion-color-primary);
        font-weight: bold;
      }
      ion-button .fouly-title-introduction {
        color: var(--ion-color-primary-contrast);
      }
    `
  ],
  template: `
    <span [innerHtml]="html"></span>
  `,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class IntroductionInnerHtmlComponent implements OnInit {
  @Input() html;
  constructor() {}

  ngOnInit() {}
}
