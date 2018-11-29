import { animate, query, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, ViewChild } from '@angular/core';
import { SatPopover } from '@ncstate/sat-popover';

@Component({
  selector: 'app-speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss'],
  animations: [
    trigger('spinInOut', [
      state('in', style({transform: 'rotate(0)', opacity: '1'})),
      transition(':enter', [
        style({transform: 'rotate(-180deg)', opacity: '0'}),
        animate('150ms ease'),
      ]),
      transition(':leave', [
        animate('150ms ease', style({transform: 'rotate(180deg)', opacity: '0'})),
      ]),
    ]),
    trigger('preventInitialAnimation', [
      transition(':enter', [
        query(':enter', [], {optional: true}),
      ]),
    ]),
  ],
})
export class SpeedDialComponent {
  @Input() icon = 'edit';
  @Input() closeIcon = 'close';
  @Input() align: 'above' | 'below' = 'above';
  @Input() disabled = false;
  @Input() progress = false;

  @ViewChild('dial') private dial: SatPopover;

  close() {
    this.dial.close();
  }
}
