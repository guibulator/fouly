import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'fouly-affluence',
  templateUrl: 'affluence.component.html'
})
export class FoulyAffluenceComponent implements OnInit, AfterViewInit, OnDestroy {
  private subs = new Subscription();
  @Input() crowdStatus: string;
  @Input() crowdColor: string;
  @Output() contribute = new EventEmitter();

  @ViewChild('contribute', { read: ElementRef }) contributeChild: ElementRef;
  constructor() {}

  ngAfterViewInit(): void {
    this.subs.add(
      fromEvent(this.contributeChild.nativeElement, 'click').subscribe((e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        this.contribute.emit();
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
