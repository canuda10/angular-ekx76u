import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, HostListener } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { trigger, transition, style, animate, AnimationEvent } from '@angular/animations';

const TRANSITION = 1000;

@Component({
  selector: 'app-background-image',
  templateUrl: './background-image.component.html',
  styleUrls: ['./background-image.component.css'],
  animations: [
    trigger('state', [
      transition(':enter', [style({ opacity: 0 }), animate(TRANSITION)]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundImageComponent implements OnInit {

  style: SafeStyle;

  @Input()
  set url(value: string) {
    this.style = this.sanitizer.bypassSecurityTrustStyle(`url("${value}")"`);
  }

  @Output()
  imageLoaded = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  @HostListener('@state.done', ['$event'])
  onStateDone(ev: AnimationEvent): void {
    if (ev.toState !== 'void')
      this.imageLoaded.emit();
  }
}