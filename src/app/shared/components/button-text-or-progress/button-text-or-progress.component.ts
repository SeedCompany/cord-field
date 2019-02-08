import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-text-or-progress',
  templateUrl: './button-text-or-progress.component.html',
  styleUrls: ['./button-text-or-progress.component.scss'],
})
export class ButtonTextOrProgressComponent {
  @Input() showProgress: boolean;
}
