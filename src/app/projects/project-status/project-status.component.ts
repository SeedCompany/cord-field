import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProjectStatus } from '@app/core/models/project/status';
import { ProjectService } from '@app/core/services/project.service';
import { TypedFormControl } from '@app/core/util';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss'],
})
export class ProjectStatusComponent extends SubscriptionComponent implements OnInit {
  readonly ProjectStatus = ProjectStatus;

  statusCtrl: TypedFormControl<ProjectStatus> = new FormControl(status);
  availableStatuses: Array<[string, ProjectStatus]> = [];

  constructor(private viewState: ProjectViewStateService,
              private projectService: ProjectService) {
    super();
  }

  ngOnInit(): void {
    this.viewState.project
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(p => {
        this.statusCtrl.reset(p.status, { emitEvent: false });
        this.availableStatuses = this.projectService.getAvailableStatuses(p);
      });

    this.statusCtrl.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.viewState.change({ status });
      });
  }

  trackByStatus(index: number, item: [string, ProjectStatus]): ProjectStatus {
    return item[1];
  }
}
