import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../core/models/project';
import { SubscriptionComponent } from '../shared/components/subscription.component';
import { ProjectViewStateService } from './project-view-state.service';

export abstract class ProjectTabComponent extends SubscriptionComponent implements OnInit {

  public project$: Observable<Project>;
  public project: Project;

  constructor(protected projectViewState: ProjectViewStateService) {
    super();
  }

  ngOnInit() {
    this.project$ = this.projectViewState.project
      .pipe(takeUntil(this.unsubscribe));
    this.project$.subscribe(project => this.project = project);
  }
}
