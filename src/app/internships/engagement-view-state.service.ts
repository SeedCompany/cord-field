import { Injectable } from '@angular/core';
import {
  EditableInternshipEngagement as EditableEngagement,
  EmptyInternshipEngagement as EmptyEngagement,
  Internship,
  InternshipEngagement as Engagement,
  InternshipEngagementTag as EngagementTag,
} from '@app/core/models/internship';
import { Location } from '@app/core/models/location';
import { User } from '@app/core/models/user';
import { InternshipService } from '@app/core/services/internship.service';
import { SessionStorageService } from '@app/core/services/storage.service';
import { filterRequired, skipEmptyViewState } from '@app/core/util';
import { InternshipViewStateService } from '@app/internships/internship-view-state.service';
import { first, map, takeUntil } from 'rxjs/operators';
import { AbstractViewState, SaveResult } from '../core/abstract-view-state';
import { ChangeConfig, dateConfig } from '../core/change-engine';

const config: ChangeConfig<EditableEngagement> = {
  status: {},
  countryOfOrigin: {
    ...Location.fieldConfig(),
    key: 'countryOfOriginId',
  },
  mentor: {
    ...User.fieldConfig(),
    key: 'mentorId',
  },
  position: {},
  methodologies: {},
  tags: EngagementTag.fieldConfigList,
  completeDate: dateConfig,
  disbursementCompleteDate: dateConfig,
  communicationsCompleteDate: dateConfig,
  ceremonyEstimatedDate: dateConfig,
  ceremonyActualDate: dateConfig,
};

@Injectable()
export class EngagementViewStateService extends AbstractViewState<Engagement, Partial<EditableEngagement>> {

  private internship: Internship;

  constructor(
    storage: SessionStorageService,
    private internships: InternshipService,
    private internshipViewState: InternshipViewStateService,
  ) {
    super(config, EmptyEngagement, storage);

    this.internshipViewState.subject
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(p => this.internship = p);
  }

  onNewId = (id: string) => {
    this.internshipViewState.subject
      .pipe(
        skipEmptyViewState(),
        first(),
        map(project => project.engagements.find(e => e.id === id)),
        filterRequired(),
      )
      .subscribe(this.onLoad);
  };

  protected async onSave(original: Engagement, changes: Partial<EditableEngagement>): Promise<SaveResult<Engagement>> {
    await this.internships.saveEngagement(original.id, changes);
    const engagement = original.withChanges(changes);
    this.internshipViewState.updateEngagement(engagement);
    return {};
  }

  protected refresh(engagement: Engagement): void {
  }

  protected identify(engagement: Engagement): string {
    if (!this.internship || !this.internship.id) {
      throw new Error('Trying to identify engagement without internship');
    }
    return `engagement-${this.internship.id}-${engagement.intern.fullName}`;
  }
}
