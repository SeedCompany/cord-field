import { OnInit } from '@angular/core';
import { UserProfile } from '@app/core/models/user';
import { IsDirty } from '@app/core/route-guards/dirty.guard';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserViewStateService } from '../user-view-state.service';

export abstract class AbstractPersonComponent extends SubscriptionComponent implements OnInit, IsDirty {
  public user$: Observable<UserProfile>;
  user: UserProfile;

  protected constructor(protected userViewState: UserViewStateService) {
    super();
  }

  ngOnInit(): void {
    this.user$ = this.userViewState.user
      .pipe(takeUntil(this.unsubscribe));
    this.user$.subscribe(u => this.user = u);
  }

  get isDirty() {
    return this.userViewState.isDirty;
  }
  onSave() {
    return this.userViewState.save();
  }
  onDiscard() {
    return this.userViewState.discard();
  }
}
