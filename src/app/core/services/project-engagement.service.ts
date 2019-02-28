import { Injectable } from '@angular/core';
import {
  EditableProjectEngagement as EditableEngagement,
  ProjectEngagementStatus as EngagementStatus,
} from '@app/core/models/project';
import { PloApiService } from '@app/core/services/http/plo-api.service';
import { StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';

@Injectable({
  providedIn: 'root',
})
export class ProjectEngagementService {

  constructor(private ploApi: PloApiService) {
  }

  async save(engagementId: string, data: EditableEngagement): Promise<void> {
    await this.ploApi
      .put(`/engagements/${engagementId}/save`, data)
      .toPromise();
  }

  getAvailableStatuses(engagement: { status: EngagementStatus, possibleStatuses: EngagementStatus[] }): StatusOptions<EngagementStatus> {
    const transitions = this.getAvailableStatusesInner(engagement.status)
      .filter(([text, status]) => !status || engagement.possibleStatuses.includes(status))
      .map(([ui, value]) => ({ ui, value }));
    const bypassWorkflow = engagement.possibleStatuses.length === EngagementStatus.length;
    const overrides = bypassWorkflow
      ? EngagementStatus.entries()
        .filter(entry => entry.value !== engagement.status)
      : [];
    return { transitions, overrides };
  }

  private getAvailableStatusesInner(status: EngagementStatus): Array<[string, EngagementStatus]> {
    switch (status) {
      case EngagementStatus.Active:
        return [
          ['Suspend', EngagementStatus.Suspended],
          ['Terminate', EngagementStatus.Terminated],
          ['Complete', EngagementStatus.Completed],
          ['Convert', EngagementStatus.Converted],
        ];
      case EngagementStatus.InDevelopment:
        return [
          ['Approve', EngagementStatus.Active],
        ];
      case EngagementStatus.Suspended:
        return [
          ['Reactivate', EngagementStatus.Active],
          ['Terminate', EngagementStatus.Terminated],
        ];
      default:
        return [];
    }
  }
}
