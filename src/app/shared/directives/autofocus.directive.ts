import { Directive, ElementRef, NgZone, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

@Directive({
  selector: '[autofocus]',
})
export class AutofocusDirective implements OnInit {

  constructor(private el: ElementRef, private zone: NgZone) {
  }

  ngOnInit() {
    this.zone.onStable.pipe(first()).subscribe(() => {
      this.el.nativeElement.focus();
    });
  }
}
