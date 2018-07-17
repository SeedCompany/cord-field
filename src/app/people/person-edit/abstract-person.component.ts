import { OnInit } from '@angular/core';
import { UserProfile } from '../../core/models/user';
import { SubscriptionComponent } from '../../shared/components/subscription.component';
import { UserViewStateService } from '../user-view-state.service';

export abstract class AbstractPersonComponent extends SubscriptionComponent implements OnInit {
  protected user: UserProfile;

  constructor(protected userViewState: UserViewStateService) {
    super();
  }

  ngOnInit(): void {
    this.userViewState.user
      .takeUntil(this.unsubscribe)
      .subscribe(u => this.user = u);
  }
}
