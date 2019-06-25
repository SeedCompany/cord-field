import { Language } from '@app/core/models/language';
import { Product } from '@app/core/models/product';
import { clone, maybeDate } from '@app/core/util';
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
    engagement.initialEndDate = maybeDate(json.initialEndDate);
    engagement.currentEndDate = maybeDate(json.currentEndDate);
    engagement.completeDate = maybeDate(json.completeDate);
    engagement.disbursementCompleteDate = maybeDate(json.disbursementCompleteDate);
    engagement.communicationsCompleteDate = maybeDate(json.communicationsCompleteDate);
    engagement.ceremonyEstimatedDate = maybeDate(json.ceremonyEstimatedDate);
    engagement.ceremonyActualDate = maybeDate(json.ceremonyActualDate);
    engagement.updatedAt = maybeDate(json.updatedAt);

    return engagement;
  }

  hasTag(name: string): boolean {
    return this.tags.some(tag => tag === name);
  }
}

export const EmptyProjectEngagement = ProjectEngagement.fromJson({
  language: {},
});
