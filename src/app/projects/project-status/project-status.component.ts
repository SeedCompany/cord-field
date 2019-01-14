import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Project } from '@app/core/models/project';
import { ProjectStatus } from '@app/core/models/project/status';
import { ProjectService } from '@app/core/services/project.service';
import { TypedFormControl } from '@app/core/util';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss'],
})
export class ProjectStatusComponent extends SubscriptionComponent implements OnInit {
  readonly ProjectStatus = ProjectStatus;

  statusCtrl: TypedFormControl<ProjectStatus> = new FormControl();
  project: Project;

  constructor(private viewState: ProjectViewStateService,
              private projectService: ProjectService) {
    super();
  }

  ngOnInit(): void {
    combineLatest(
      this.viewState.project,
      this.viewState.subjectWithPreExistingChanges,
    )
      .pipe(
        filter(([p]) => Boolean(p.id)),
        takeUntil(this.unsubscribe),
      )
      .subscribe(([original, current]) => {
        this.project = original;
        this.statusCtrl.reset(current.status, { emitEvent: false });
      });

    this.statusCtrl.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.viewState.change({ status });
      });
  }

  findAvailableStatuses = (value: ProjectStatus): StatusOptions<ProjectStatus> => {
    return this.projectService.getAvailableStatuses(this.project);
  }
}
