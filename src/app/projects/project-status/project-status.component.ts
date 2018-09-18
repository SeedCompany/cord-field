import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProjectStatus } from '@app/core/models/project/status';
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

  readonly ProjectStatus = ProjectStatus;

  @Input() status: ProjectStatus;

  control: TypedFormControl<ProjectStatus> = new FormControl(status);

  constructor(private viewState: ProjectViewStateService) {
    super();
  }

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.viewState.change({ status });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.status) {
      this.control.reset(changes.status.currentValue, {emitEvent: false});
    }
  }

  getOptions(): Array<[string, ProjectStatus]> {
    const status = this.control.value;

    if (status === ProjectStatus.InDevelopment) {
      return [
        ['Submit for Approval', ProjectStatus.PendingApproval]
      ];
    }
    if (status === ProjectStatus.PendingApproval) {
      return [
        ['Send Back for Corrections', ProjectStatus.InDevelopment],
        ['Reject Project', ProjectStatus.Rejected],
        ['Approve Project', ProjectStatus.Active]
      ];
    }
    if (status === ProjectStatus.Active) {
      return [
        ['Suspend Project', ProjectStatus.Suspended],
        ['Terminate Project', ProjectStatus.Terminated],
        ['Complete Project', ProjectStatus.Completed]
      ];
    }
    if (status === ProjectStatus.Suspended) {
      return [
        ['Reactivate Project', ProjectStatus.Active],
        ['Terminate Project', ProjectStatus.Terminated]
      ];
    }

    return [];
  }

  trackOptionBy(index: number, value: [string, ProjectStatus]): ProjectStatus {
    return value[1];
  }
}
