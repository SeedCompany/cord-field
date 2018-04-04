import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({width: 0}),
        animate('200ms ease-in')
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({width: 0}))
      ])
    ])
  ]
})
export class SearchComponent {
  /** Whether to send empty strings through search event when the input is cleared. */
  @Input() emitClears = true;
  /** Whether to clear the input when the search box is closed. */
  @Input() clearOnClose = true;
  /** Whether to close the search box when the input blurs with an empty value */
  @Input() autoClose = true;

  @Output() search = new EventEmitter<string>();

  value = '';
  focused = false;

  onToggle() {
    if (this.focused) {
      this.onClose();
    } else {
      this.focused = true;
    }
  }

  onBlur() {
    if (this.autoClose && !this.value) {
      this.onClose();
    }
  }

  onChange() {
    if (!this.emitClears && !this.value) {
      return;
    }

    this.search.emit(this.value);
  }

  onClear() {
    this.value = '';
    if (this.emitClears) {
      this.search.emit('');
    }
  }

  onClose() {
    this.focused = false;
    if (this.clearOnClose) {
      this.onClear();
    }
  }
}
