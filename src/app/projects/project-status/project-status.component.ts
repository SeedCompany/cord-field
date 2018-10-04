import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
  styleUrls: ['./project-status.component.scss']
})
export class ProjectStatusComponent extends SubscriptionComponent implements OnInit, OnChanges {
  @Input() status: ProjectStatus;

  readonly ProjectStatus = ProjectStatus;

  statusCtrl: TypedFormControl<ProjectStatus> = new FormControl(status);
  currentStatus: ProjectStatus;

  constructor(private viewStateService: ProjectViewStateService,
              private projectService: ProjectService) {
    super();
  }

  ngOnInit(): void {
    this.statusCtrl.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.viewStateService.change({ status });
      });

    this.viewStateService.project.subscribe(project => {
      this.currentStatus = project.status;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status) {
      this.statusCtrl.reset(changes.status.currentValue, { emitEvent: false });
    }
  }

  getStatuses(): Array<[string, ProjectStatus]> {
    return this.projectService.getAvailableStatuses(this.currentStatus);
  }

  trackByStatus(index: number, item: [string, ProjectStatus]): ProjectStatus {
    return item[1];
  }
}
