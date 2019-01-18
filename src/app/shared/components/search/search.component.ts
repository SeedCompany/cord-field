import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({width: 0}),
        animate('200ms ease-in'),
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({width: 0})),
      ]),
    ]),
  ],
})
export class SearchComponent {
  /** Whether to send empty strings through search event when the input is cleared. */
  @Input() emitClears = true;
  /** Whether to clear the input when the search box is closed. */
  @Input() clearOnClose = true;
  /** Whether to close the search box when the input blurs with an empty value */
  @Input() autoClose = true;

  @Output() search = new EventEmitter<string>();

  @Input()
  get value() { return this._value; }
  set value(value: string) {
    this._value = value;
    this.focused = Boolean(value);
  }
  private _value = '';
  focused = false;
  private lastBlur = DateTime.fromMillis(0);

  onToggle() {
    // Clicking the toggle button fires the input blur event first. Since blurring can also toggle
    // showing the input if the value is empty this would re-show the input immediately.
    // Prevent this by only doing toggle if the last blur time was more than half a second.
    const diff = DateTime.local().diff(this.lastBlur);
    if (diff.as('seconds') < 0.5) {
      return;
    }

    if (this.focused) {
      this.onClose();
    } else {
      this.focused = true;
    }
  }

  onBlur() {
    this.lastBlur = DateTime.local();
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
