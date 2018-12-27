import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TitleAware, TitleProp } from '@app/core/decorators';
import { popInOut } from '@app/shared/animations';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { of as observableOf } from 'rxjs';
import { filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ProjectViewStateService } from '../project-view-state.service';

interface TabConfig {
  path: string;
  label: string;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  animations: [popInOut],
  providers: [
    ProjectViewStateService,
  ],
})
@TitleAware()
export class ProjectComponent extends SubscriptionComponent implements OnInit, TitleProp {

  readonly tabs: TabConfig[] = [
    {path: 'overview', label: 'Overview'},
    {path: 'forms', label: 'Forms'},
    {path: 'engagements', label: 'Engagements'},
    {path: 'budget', label: 'Budget'},
    {path: 'files', label: 'Files'},
    {path: 'team', label: 'Team'},
    // {path: 'extensions', label: 'Extensions'},
    // {path: 'updates', label: 'Updates'},
  ];

  dirty = false;
  submitting = false;
  private shouldCurrentTabShowSaveFab: boolean;

  private snackBarRef: MatSnackBarRef<SimpleSnackBar> | null;

  constructor(
    private projectViewState: ProjectViewStateService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectViewState.onNewId(params.id);
    });
    this.projectViewState.loadError
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(err => {
        if (err instanceof HttpErrorResponse && (err.status === 404 || err.status === 400)) {
          this.router.navigate(['**'], {skipLocationChange: true});
          return;
        }
        this.snackBar.open('Failed to fetch project details', undefined, {duration: 5000});
        this.router.navigate(['..'], {replaceUrl: true, relativeTo: this.route});
      });
    this.projectViewState.isDirty
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(dirty => this.dirty = dirty);
    this.projectViewState.isSubmitting
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(submitting => this.submitting = submitting);

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
    return this.projectViewState.projectWithChanges
      .pipe(map(project => project.name));
  }

  trackTabsBy(index: number, tab: TabConfig) {
    return tab.path;
  }

  async onSave() {
    try {
      await this.projectViewState.save();
    } catch (e) {
      this.snackBarRef = this.snackBar.open('Failed to save project', undefined, {
        duration: 3000,
      });
      return;
    }
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  onDiscard() {
    this.projectViewState.discard();
  }
}
