import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const REFRESH = 5000;

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundComponent implements OnInit {

  readonly urls = [];

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.updateBackground();
  }

  private updateBackground(): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const url = `https://picsum.photos/${rect.width}/${rect.height}.webp?random`;
    this.http.get(url, { responseType: 'blob' })
    .subscribe(
      response => {
        this.urls.push(URL.createObjectURL(response));

        // as this.urls has changed but is not an @Input, we must mark this component
        // for change detection to run.
        this.changeDetectorRef.markForCheck();

        setTimeout(() => this.updateBackground(), REFRESH);
      },
      error => {
        console.log(error);
        // In case of an error we update background again immediately.
        this.updateBackground();
      },
      // () => {
      //   setTimeout(() => this.updateBackground(), REFRESH);
      // }
    )
  }

  // When an image has been loaded, if it is not the only one in the array,
  // then remove the first one.
  // No need to mark for change detection because this is called from an @Output, which
  // does already take care of that.
  onImageLoaded() {
    if (this.urls.length > 1) {
      URL.revokeObjectURL(this.urls.shift());
    }
  }
}