import { AfterViewChecked, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

const DEFAULT_MASK = '********';
const REDACTED_VALUE = '🙈';

@Directive({
  selector: '[redactable]'
})
export class RedactableDirective implements AfterViewChecked {
  @Input() mask: string = DEFAULT_MASK;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewChecked(): void {
    const elem = this.elementRef.nativeElement;

    if (elem.nodeName === 'INPUT' && elem.value === REDACTED_VALUE) {
      this.renderer.setProperty(elem, 'value', this.mask);
    } else if (elem.textContent === REDACTED_VALUE) {
      this.renderer.setProperty(elem, 'textContent', this.mask);
    }
  }
}
