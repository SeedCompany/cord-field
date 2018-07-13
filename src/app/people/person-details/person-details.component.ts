import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserProfile } from '../../core/models/user';
import { UserViewStateService } from '../user-view-state.service';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss'],
  providers: [
    UserViewStateService
  ]
})
export class PersonDetailsComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject<void>();

  user: UserProfile;

  constructor(private route: ActivatedRoute,
              private userViewState: UserViewStateService) {
  }

  async ngOnInit() {
    this.route.params
      .takeUntil(this.unsubscribe)
      .subscribe(params => {
        this.userViewState.next(params.id);
      });
    this.userViewState.user
      .takeUntil(this.unsubscribe)
      .subscribe(u => this.user = u);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
