import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-save-discard-dial',
  templateUrl: './save-discard-dial.component.html',
  styleUrls: ['./save-discard-dial.component.scss'],
})
export class SaveDiscardDialComponent {
  @Input() dirty: boolean;
  @Input() submitting: boolean;

  @Output() save = new EventEmitter<void>();
  @Output() discard = new EventEmitter<void>();
}
