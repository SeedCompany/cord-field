import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '@app/core/services/logger.service';
import { map, takeUntil } from 'rxjs/operators';
import { TitleAware, TitleProp } from '../../core/decorators';
import { SubscriptionComponent } from '../../shared/components/subscription.component';
import { UserViewStateService } from '../user-view-state.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
  providers: [UserViewStateService],
})
@TitleAware()
export class PersonComponent extends SubscriptionComponent implements OnInit, TitleProp {
  constructor(
    private userViewState: UserViewStateService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
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
        let message: string;
        if (err instanceof HttpErrorResponse) {
          message = (err.status === 404 || err.status === 400)
            ? 'Could not find person'
            : 'Failed to fetch person details';
        } else {
          message = 'Failed to parse person details';
          // http errors are already logged, but parse errors are not
          this.logger.error(err);
        }
        this.snackBar.open(message, undefined, {duration: 5000});
        this.router.navigate(['..'], {replaceUrl: true, relativeTo: this.route});
      });
  }

  get title() {
    return this.userViewState.user
      .pipe(map(user => user.fullName));
  }
}
