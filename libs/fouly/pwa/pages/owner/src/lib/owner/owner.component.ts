import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'fouly-owner',
  templateUrl: 'owner.component.html'
})
export class OwnerComponent {
  title: string;
  constructor(private activatedRoute: ActivatedRoute) {
    activatedRoute.url.subscribe(() => {
      this.title = this.activatedRoute.snapshot.firstChild.data.title;
    });
  }
}
