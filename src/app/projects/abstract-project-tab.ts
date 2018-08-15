import { OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../core/models/project';
import { SubscriptionComponent } from '../shared/components/subscription.component';
import { ProjectViewStateService } from './project-view-state.service';

export abstract class ProjectTabComponent extends SubscriptionComponent implements OnInit {

  public project: Project;

  constructor(protected projectViewState: ProjectViewStateService) {
    super();
  }

  ngOnInit() {
    this.projectViewState.project
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(project => this.project = project);
  }
}
