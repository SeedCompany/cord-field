import { Directive, ElementRef, Input, NgZone, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

@Directive({
  selector: '[autofocus]',
})
export class AutofocusDirective implements OnInit {

  @Input() autofocus = true;

  constructor(private el: ElementRef, private zone: NgZone) {
  }

  ngOnInit() {
    if (!this.autofocus) {
      return;
    }
    this.zone.onStable.pipe(first()).subscribe(() => {
      this.el.nativeElement.focus();
    });
  }
}
