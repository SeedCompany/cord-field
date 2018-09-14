import { AfterViewChecked, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { isRedacted } from '@app/core/util';

const DEFAULT_MASK = '********';

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

    if (elem.nodeName === 'INPUT' && isRedacted(elem.value)) {
      this.renderer.setProperty(elem, 'value', this.mask);
      this.renderer.setAttribute(elem, 'disabled', 'disabled');
    } else if (isRedacted(elem.textContent)) {
      this.renderer.setProperty(elem, 'textContent', this.mask);
    }
  }
}
