import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { TitleAware, TitleProp } from '../../core/decorators';
import { SubscriptionComponent } from '../../shared/components/subscription.component';
import { UserViewStateService } from '../user-view-state.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
  providers: [UserViewStateService]
})
@TitleAware()
export class PersonComponent extends SubscriptionComponent implements OnInit, TitleProp {
  constructor(
    private userViewState: UserViewStateService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.userViewState.next(params.id);
    });

    this.userViewState.loadError
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(err => {
        const message = (err instanceof HttpErrorResponse && err.status === 404)
          ? 'Could not find person'
          : 'Failed to fetch person details';
        this.snackBar.open(message, undefined, {duration: 5000});
        this.router.navigate(['..'], {replaceUrl: true, relativeTo: this.route});
      });
  }

  get title() {
    return this.userViewState.user
      .pipe(map(user => user.fullName));
  }
}
