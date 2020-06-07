import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'fouly-affluence',
  templateUrl: 'affluence.component.html'
})
export class FoulyAffluenceComponent implements OnInit, AfterViewInit, OnDestroy {
  private subs = new Subscription();
  @ViewChild('affluence', { static: true, read: ElementRef }) affluence: ElementRef;
  constructor() {}

  ngAfterViewInit(): void {
    this.subs.add(
      fromEvent(this.affluence.nativeElement, 'click').subscribe((e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      })
    );
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
