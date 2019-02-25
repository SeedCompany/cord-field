import { animate, animateChild, AnimationEvent, group, query, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { SatPopover } from '@ncstate/sat-popover';
import { BehaviorSubject, merge, of } from 'rxjs';
import { first, map, mapTo, mergeMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-speed-dial',
  templateUrl: './speed-dial.component.html',
  styleUrls: ['./speed-dial.component.scss'],
  animations: [
    trigger('fab', [
      state('show', style({ transform: 'scale(1)', opacity: 1, 'box-shadow': '*' })),
      state('void', style({ transform: 'scale(0)', opacity: 0, 'box-shadow': '*' })),
      transition('* => show', [
        group([
          query('@fabIcon', animateChild()),
          animate('280ms 0ms cubic-bezier(.4, 0, .2, 1)', style({ 'box-shadow': '*' })),
          animate('15ms 30ms linear', style({ opacity: 1 })),
          animate('270ms 0ms cubic-bezier(0, 0, .2, 1)', style({ transform: 'scale(1)' })),
        ]),
      ]),
      transition('show => *', [
        group([
          query('@fabIcon', animateChild()),
          animate('15ms 150ms linear', style({ opacity: 0 })),
          animate('180ms 0ms cubic-bezier(.4, 0, 1, 1)', style({ transform: 'scale(0)' })),
        ]),
      ]),
    ]),
    trigger('fabIcon', [
      state('show', style({ transform: 'scale(1) rotate(0)', opacity: 1 })),
      state('changing', style({ transform: 'scale(1) rotate(-90deg)', opacity: 0 })),
      state('void', style({ transform: 'scale(0)', opacity: 1 })),
      transition('void => show', [
        animate('180ms 90ms cubic-bezier(0, 0, .2, 1)', style({ transform: 'scale(1)' })),
      ]),
      transition('show => void', [
        style({ transform: 'scale(1)' }),
        animate('135ms cubic-bezier(.4, 0, 1, 1)'),
      ]),
      transition('show => changing', [
        animate('80ms cubic-bezier(.4, 0, 1, 1)', style({ transform: 'rotate(90deg)', opacity: 0 })),
      ]),
      transition('changing => show', [
        animate('100ms cubic-bezier(0, 0, .2, 1)'),
      ]),
    ]),
  ],
})
export class SpeedDialComponent extends SubscriptionComponent implements AfterViewInit {

  @Input()
  get show() {
    return this._show.getValue();
  }
  set show(show: boolean) {
    this._show.next(show);
  }
  private _show = new BehaviorSubject<boolean>(false);

  @Input()
  get icon() {
    return this._icon;
  }
  set icon(icon: string) {
    this._icon = icon;
    if (!this.dial.isOpen()) {
      this.currentIcon = icon;
    }
  }
  private _icon = 'edit';

  @Input()
  get closeIcon() {
    return this._closeIcon;
  }
  set closeIcon(closeIcon: string) {
    this._closeIcon = closeIcon;
    if (this.dial.isOpen()) {
      this.currentIcon = closeIcon;
    }
  }
  private _closeIcon = 'close';

  @Input() align: 'above' | 'below' = 'above';
  @Input() disabled = false;
  @Input() progress = false;

  @ViewChild('dial') dial: SatPopover;

  fabAnimationState: 'show' | 'void' = 'void';
  iconAnimationState: 'show' | 'void' | 'changing' = 'void';
  currentIcon = this.icon;

  ngAfterViewInit(): void {
    this._show
      .pipe(
        mergeMap(show => {
          if (show || !this.dial.isOpen()) {
            return of(show);
          }
          this.dial.close();
          return this.dial.afterClose.pipe(first(), mapTo(show));
        }),
        map(show => show ? 'show' : 'void'),
        takeUntil(this.unsubscribe),
      )
      .subscribe(animState => {
        this.fabAnimationState = animState;
        this.iconAnimationState = animState;
      });

    merge(
      this.dial.opened,
      this.dial.closed,
    )
      .pipe(
        takeUntil(this.unsubscribe),
      )
      .subscribe(() => {
        this.iconAnimationState = 'changing';
      });
  }

  onIconAnimationDone(event: AnimationEvent) {
    if (event.toState === 'changing') {
      this.currentIcon = this.dial.isOpen() ? this.closeIcon : this.icon;
      this.iconAnimationState = 'show';
    }
  }
}
