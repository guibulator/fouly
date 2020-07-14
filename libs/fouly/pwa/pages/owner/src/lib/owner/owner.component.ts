import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'fouly-owner',
  templateUrl: 'owner.component.html'
})
export class OwnerComponent implements OnInit {
  title: string;
  constructor(private activatedRoute: ActivatedRoute, router: Router) {
    activatedRoute.url.subscribe(() => {
      this.title = activatedRoute.snapshot.firstChild.data.title;
    });
  }

  ngOnInit() {
    console.log(this.activatedRoute);
  }
}
