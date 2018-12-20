import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-avatar-letter',
  templateUrl: './avatar-letter.component.html',
  styleUrls: ['./avatar-letter.component.scss'],
})
export class AvatarLetterComponent {
  @Input() color: 'primary' | 'accent';
  @HostBinding('class.mat-primary') get isPrimary() { return this.color === 'primary'; }
  @HostBinding('class.mat-accent') get isAccent() { return this.color === 'accent'; }
}
