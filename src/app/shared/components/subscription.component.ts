import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class SubscriptionComponent implements OnDestroy {
  protected readonly unsubscribe = new Subject<void>();

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
