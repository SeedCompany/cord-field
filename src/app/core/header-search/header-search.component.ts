import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
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
export class HeaderSearchComponent {
  value = '';
  focused = false;
}
