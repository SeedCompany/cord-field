import { Injectable } from '@angular/core';
import { EditableEngagement, Engagement, EngagementStatus } from '@app/core/models/engagement';
import { EnumList } from '@app/core/models/enum';
import { PloApiService } from '@app/core/services/http/plo-api.service';
import { StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EngagementService {

  constructor(private ploApi: PloApiService) {
  }

  getEngagement(id: string): Promise<Engagement> {
    return this.ploApi
      .get<Engagement>(`/engagements/${id}`)
      .pipe(map(Engagement.fromJson))
      .toPromise();
  }

  async save(engagementId: string, data: EditableEngagement): Promise<void> {
    await this.ploApi
      .put<Engagement>(`/engagements/${engagementId}/save`, data)
      .toPromise();
  }

  getAvailableStatuses(engagement: Engagement): StatusOptions<EngagementStatus> {
    const transitions = this.getAvailableStatusesInner(engagement.status)
      .filter(([text, status]) => !status || engagement.possibleStatuses.includes(status))
      .map(([ui, value]) => ({ ui, value }));
    const bypassWorkflow = engagement.possibleStatuses.length === EngagementStatus.length;
    const overrides = bypassWorkflow
      ? (EngagementStatus.entries() as EnumList<EngagementStatus>)
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
