import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { TitleAware, TitleProp } from '../../core/decorators';
import { Project } from '../../core/models/project';
import { popInOut } from '../../shared/animations';
import { SubscriptionComponent } from '../../shared/components/subscription.component';
import { ProjectViewStateService } from '../project-view-state.service';

interface TabConfig {
  path: string;
  label: string;
  saveFab?: boolean;
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  animations: [popInOut],
  providers: [
    ProjectViewStateService
  ]
})
@TitleAware()
export class ProjectComponent extends SubscriptionComponent implements OnInit, TitleProp {

  readonly tabs: TabConfig[] = [
    {path: 'overview', label: 'Overview', saveFab: true},
    {path: 'plan', label: 'Plan', saveFab: true},
    {path: 'budget', label: 'Budget', saveFab: true},
    {path: 'files', label: 'Files'},
    {path: 'team', label: 'Team'},
    {path: 'updates', label: 'Updates'}
  ];

  project: Project;
  dirty = false;
  submitting = false;
  private shouldCurrentTabShowSaveFab: boolean;

  private snackBarRef: MatSnackBarRef<SimpleSnackBar> | null;

  constructor(
    private projectViewState: ProjectViewStateService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectViewState.onNewId(params.id);
    });
    this.projectViewState.loadError
      .takeUntil(this.unsubscribe)
      .subscribe(err => {
        const message = (err instanceof HttpErrorResponse && err.status === 404)
          ? 'Could not find project'
          : 'Failed to fetch project details';
        this.snackBar.open(message, undefined, {duration: 5000});
        this.router.navigate(['..'], {replaceUrl: true, relativeTo: this.route});
      });
    this.projectViewState.project
      .takeUntil(this.unsubscribe)
      .subscribe(project => this.project = project);
    this.projectViewState.isDirty
      .takeUntil(this.unsubscribe)
      .subscribe(dirty => this.dirty = dirty);
    this.projectViewState.isSubmitting
      .takeUntil(this.unsubscribe)
      .subscribe(submitting => this.submitting = submitting);

    this.router.events
      .takeUntil(this.unsubscribe)
      .filter(event => event instanceof NavigationEnd)
      .startWith({}) // for first load
      .switchMap(() => this.route.firstChild ? this.route.firstChild.snapshot.url : [])
      .map((segment: UrlSegment) => this.tabs.find((tab) => tab.path === segment.path)!)
      .subscribe(tab => this.shouldCurrentTabShowSaveFab = !!tab.saveFab);
  }

  get showSaveFab() {
    return this.dirty && this.shouldCurrentTabShowSaveFab;
  }

  get title() {
    return this.projectViewState.project
      .map(project => project.name);
  }

  trackTabsBy(index: number, tab: TabConfig) {
    return tab.path;
  }

  async onSave() {
    try {
      await this.projectViewState.save();
    } catch (e) {
      this.snackBarRef = this.snackBar.open('Failed to save project', undefined, {
        duration: 3000
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
