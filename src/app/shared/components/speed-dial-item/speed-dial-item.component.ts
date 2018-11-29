import { Component, Input } from '@angular/core';
import { SpeedDialComponent } from '../speed-dial/speed-dial.component';

@Component({
  selector: 'app-speed-dial-item',
  templateUrl: './speed-dial-item.component.html',
  styleUrls: ['./speed-dial-item.component.scss'],
})
export class SpeedDialItemComponent {
  @Input() color: 'primary' | 'accent' | 'warn' = 'accent';
  @Input() tooltip: string;

  constructor(private parent: SpeedDialComponent) {
  }

  onClick() {
    this.parent.close();
  }
}
