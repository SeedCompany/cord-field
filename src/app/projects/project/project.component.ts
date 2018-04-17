import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Project } from '../../core/models/project';
import { ProjectService } from '../../core/services/project.service';

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
  ]
})
export class ProjectComponent implements OnInit, OnDestroy {
  id: string;
  project = new Project();

  dirty = true;
  private shouldCurrentTabShowSaveFab: boolean;

  private idSub = Subscription.EMPTY;

  readonly tabs: TabConfig[] = [
    {path: '/overview', label: 'Overview', saveFab: true},
    {path: '/plan', label: 'Plan', saveFab: true},
    {path: '/budget', label: 'Budget', saveFab: true},
    {path: '/files', label: 'Files'},
    {path: '/people', label: 'People'},
    {path: '/updates', label: 'Updates'}
  ];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.idSub = this.route.params.subscribe(params => {
      this.id = params.id;
      this.projectService.getProject(this.id).subscribe(project => this.project = project);
    });

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .startWith({}) // for first load
      .switchMap(() => this.route.firstChild ? this.route.firstChild.snapshot.url : [])
      .map((segment: UrlSegment) => this.tabs.find((tab) => tab.path === '/' + segment.path))
      .subscribe(tab => this.shouldCurrentTabShowSaveFab = tab.saveFab);
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

  onSave() {
    this.dirty = false;
  }

  onDiscard() {
    this.dirty = false;
  }
}
