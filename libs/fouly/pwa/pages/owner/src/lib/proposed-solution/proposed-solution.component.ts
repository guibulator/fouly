import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fouly-owner-proposed-solution',
  templateUrl: 'proposed-solution.component.html',
  styleUrls: ['proposed-solution.component.scss']
})
export class OwnerProposedSolutionComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}
  private subscriptions = new Subscription();
  placeName: string;
  ngOnInit() {
    this.placeName = this.activatedRoute.snapshot.params['placeName'];
  }
}
