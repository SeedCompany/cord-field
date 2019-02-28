import { Injectable } from '@angular/core';
import { Budget } from '@app/core/models/budget';
import { EditableInternship, Internship, InternshipEngagement as Engagement } from '@app/core/models/internship';
import { InternshipService, ModifiedInternship } from '@app/core/services/internship.service';
import { SessionStorageService } from '@app/core/services/storage.service';
import { clone } from '@app/core/util';
import { first, map } from 'rxjs/operators';
import { AbstractViewState, SaveResult } from '../core/abstract-view-state';
import { ChangeConfig, dateConfig } from '../core/change-engine';
import { Location } from '../core/models/location';
import { Partnership } from '../core/models/partnership';
import { TeamMember } from '../core/models/team-member';

const config: ChangeConfig<EditableInternship> = {
  name: {},
  mouStart: {
    ...dateConfig,
    forceRefresh: true, // Dates change budget
  },
  mouEnd: {
    ...dateConfig,
    forceRefresh: true, // Dates change budget
  },
  estimatedSubmission: {
    ...dateConfig,
  },
  status: {
    forceRefresh: true, // Status changes engagement statuses
  },
  sensitivity: {},
  location: {
    ...Location.fieldConfig(),
    forceRefresh: true,
  },
  partnerships: {
    ...Partnership.fieldConfigList(),
    forceRefresh: true,
  },
  team: TeamMember.fieldConfigList(),
  budgets: Budget.fieldConfigList(),
};

@Injectable()
export class InternshipViewStateService extends AbstractViewState<Internship, ModifiedInternship> {

  constructor(
    storage: SessionStorageService,
    private internships: InternshipService,
  ) {
    super(config, Internship.fromJson({}), storage);
  }

  onNewId(id: string): void {
    this.internships.get(id)
      .subscribe(this.onLoad);
  }

  updateEngagement(engagement: Engagement): void {
    this.subject
      .pipe(
        first(),
        map(internship => {
          const next = clone(internship);
          next.engagements = [...next.engagements];

          const index = internship.engagements.findIndex(e => e.id === engagement.id);
          if (index === -1) {
            throw new Error('Could not find engagement in internship');
          }
          next.engagements[index] = engagement;

          return next;
        }),
      )
      .subscribe(this.onLoad);
  }

  protected onSave(internship: Internship, changes: ModifiedInternship): Promise<SaveResult<Internship>> {
    return this.internships.save(internship.id, changes);
  }

  protected refresh(internship: Internship): void {
    this.onNewId(internship.id);
  }

  protected identify(internship: Internship): string {
    return `internships-${internship.id}`;
  }
}
