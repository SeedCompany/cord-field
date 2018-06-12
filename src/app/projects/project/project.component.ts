import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Project } from '../../core/models/project';
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
  animations: [
    trigger('popInOut', [
      state('in', style({transform: 'scale(1)', opacity: '1'})),
      transition(':enter', [
        style({transform: 'scale(0)', opacity: '0'}),
        animate('300ms ease-in-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({transform: 'scale(0)', opacity: '0'}))
      ])
    ])
  ],
  providers: [
    ProjectViewStateService
  ]
})
export class ProjectComponent implements OnInit, OnDestroy {
  id: string;
  project: Project;

  dirty = false;
  submitting = false;
  private shouldCurrentTabShowSaveFab: boolean;

  private idSub = Subscription.EMPTY;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> | null;

  readonly tabs: TabConfig[] = [
    {path: '/overview', label: 'Overview', saveFab: true},
    {path: '/plan', label: 'Plan', saveFab: true},
    {path: '/budget', label: 'Budget', saveFab: true},
    {path: '/files', label: 'Files'},
    {path: '/team', label: 'Team'},
    {path: '/updates', label: 'Updates'}
  ];

  constructor(
    private projectViewState: ProjectViewStateService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.idSub = this.route.params.subscribe(params => {
      this.id = params.id;
      this.projectViewState.onNewId(params.id);
    });
    this.projectViewState.loadError.subscribe(err => {
      const message = (err instanceof HttpErrorResponse && err.status === 404)
        ? 'Could not find project'
        : 'Failed to fetch project details';
      this.snackBar.open(message, undefined, {duration: 5000});
      this.router.navigateByUrl('/projects', {replaceUrl: true});
    });
    this.projectViewState.project.subscribe(project => this.project = project);
    this.projectViewState.isDirty.subscribe(dirty => this.dirty = dirty);
    this.projectViewState.isSubmitting.subscribe(submitting => this.submitting = submitting);

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .startWith({}) // for first load
      .switchMap(() => this.route.firstChild ? this.route.firstChild.snapshot.url : [])
      .map((segment: UrlSegment) => this.tabs.find((tab) => tab.path === '/' + segment.path)!)
      .subscribe(tab => this.shouldCurrentTabShowSaveFab = !!tab.saveFab);
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
  }

  get showSaveFab() {
    return this.dirty && this.shouldCurrentTabShowSaveFab;
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
