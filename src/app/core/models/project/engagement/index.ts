import { Language } from '@app/core/models/language';
import { Product } from '@app/core/models/product';
import { maybeServerDate } from '@app/core/util';
import { DateTime } from 'luxon';
import { ProjectEngagementStatus } from './status';
import { ProjectEngagementTag } from './tag';

export { ProjectEngagementStatus, ProjectEngagementTag };

/**
 * Editable properties of ProjectEngagement.
 * No functions in this class.
 */
export class EditableProjectEngagement {
  status: ProjectEngagementStatus;
  products: Product[];
  tags: ProjectEngagementTag[];
  completeDate: DateTime | null;
  disbursementCompleteDate: DateTime | null;
  communicationsCompleteDate: DateTime | null;
  ceremonyEstimatedDate: DateTime | null;
  ceremonyActualDate: DateTime | null;
}

export class ProjectEngagement extends EditableProjectEngagement {
  id: string;
  possibleStatuses: ProjectEngagementStatus[];
  language: Language;
  initialEndDate: DateTime | null;
  currentEndDate: DateTime | null;
  updatedAt: DateTime | null;

  static fromJson(json: any): ProjectEngagement {
    json = json || {};

    const engagement = new ProjectEngagement();

    engagement.id = json.id;
    engagement.status = json.status || ProjectEngagementStatus.InDevelopment;
    engagement.possibleStatuses = json.possibleStatuses || [];
    engagement.language = Language.fromJson(json.language);
    engagement.products = json.products || [];
    engagement.tags = json.tags || [];
    engagement.initialEndDate = maybeServerDate(json.initialEndDate);
    engagement.currentEndDate = maybeServerDate(json.currentEndDate);
    engagement.completeDate = maybeServerDate(json.completeDate);
    engagement.disbursementCompleteDate = maybeServerDate(json.disbursementCompleteDate);
    engagement.communicationsCompleteDate = maybeServerDate(json.communicationsCompleteDate);
    engagement.ceremonyEstimatedDate = maybeServerDate(json.ceremonyEstimatedDate);
    engagement.ceremonyActualDate = maybeServerDate(json.ceremonyActualDate);
    engagement.updatedAt = maybeServerDate(json.updatedAt);

    return engagement;
  }

  hasTag(name: string): boolean {
    return this.tags.some(tag => tag === name);
  }
}

export const EmptyProjectEngagement = ProjectEngagement.fromJson({
  language: {},
});
