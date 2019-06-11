import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AbstractViewState } from '@app/core/abstract-view-state';
import { TitleAware, TitleProp } from '@app/core/decorators';
import { LoggerService } from '@app/core/services/logger.service';
import { InternshipViewStateService } from '@app/internships/internship-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { of as observableOf } from 'rxjs';
import { filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

interface TabConfig {
  path: string;
  label: string;
}

@Component({
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.scss'],
  providers: [
    InternshipViewStateService,
    { provide: AbstractViewState, useExisting: InternshipViewStateService },
  ],
})
@TitleAware()
export class InternshipComponent extends SubscriptionComponent implements OnInit, TitleProp {

  readonly tabs: TabConfig[] = [
    {path: 'overview', label: 'Overview'},
    {path: 'forms', label: 'Forms'},
    {path: 'engagements', label: 'Plan'},
    {path: 'budget', label: 'Budget'},
    {path: 'files', label: 'Files'},
    {path: 'team', label: 'Team'},
  ];

  dirty = false;
  submitting = this.viewState.isSubmitting;
  private shouldCurrentTabShowSaveFab: boolean;

  private snackBarRef: MatSnackBarRef<SimpleSnackBar> | null;

  constructor(
    private viewState: InternshipViewStateService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private logger: LoggerService,
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.viewState.onNewId(params.id);
    });
    this.viewState.loadError
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(err => {
        let message: string;
        if (err instanceof HttpErrorResponse) {
          message = (err.status === 404 || err.status === 400)
            ? 'Could not find internship'
            : 'Failed to fetch internship details';
        } else {
          message = 'Failed to parse internship details';
          // http errors are already logged, but parse errors are not
          this.logger.error(err);
        }
        this.snackBar.open(message, undefined, {duration: 5000});
        this.router.navigate(['..'], {replaceUrl: true, relativeTo: this.route});
      });
    this.viewState.isDirty
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(dirty => this.dirty = dirty);

    this.router.events
      .pipe(
        takeUntil(this.unsubscribe),
        filter(event => event instanceof NavigationEnd),
        startWith({}), // for first load
        switchMap(() => this.route.firstChild ? this.route.firstChild.data : observableOf({})),
        map(data => Boolean(data.acceptDirty)),
      )
      .subscribe(showFab => this.shouldCurrentTabShowSaveFab = showFab);
  }

  get showSaveFab() {
    return this.dirty && this.shouldCurrentTabShowSaveFab;
  }

  get title() {
    return this.viewState.subjectWithChanges
      .pipe(map(internship => internship.name));
  }

  trackTabsBy(index: number, tab: TabConfig) {
    return tab.path;
  }

  async onSave() {
    try {
      await this.viewState.save();
    } catch (e) {
      const msg = e.status === 403 ? 'Changes requested are forbidden' : 'Failed to save internship';
      this.snackBarRef = this.snackBar.open(msg, undefined, {
        duration: 3000,
      });
      return;
    }
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  onDiscard() {
    return this.viewState.discard();
  }
}
