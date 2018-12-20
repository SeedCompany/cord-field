import { animate, state, style, transition, trigger } from '@angular/animations';

export const popInOut = trigger('popInOut', [
  state('in', style({transform: 'scale(1)', opacity: '1'})),
  transition(':enter', [
    style({transform: 'scale(0)', opacity: '0'}),
    animate('300ms ease-in-out'),
  ]),
  transition(':leave', [
    animate('300ms ease-in-out', style({transform: 'scale(0)', opacity: '0'})),
  ]),
]);
