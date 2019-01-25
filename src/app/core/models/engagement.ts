import { Language } from '@app/core/models/language';
import { Product } from '@app/core/models/product';
import { clone, maybeDate } from '@app/core/util';
import { DateTime } from 'luxon';
import { EngagementStatus } from './engagement/status';

export { EngagementStatus };

/**
 * Editable properties of Engagement.
 * No functions in this class.
 */
export class EditableEngagement {
  status: EngagementStatus;
  products: Product[];
  tags: string[];
  completeDate: DateTime | null;
  disbursementCompleteDate: DateTime | null;
  communicationsCompleteDate: DateTime | null;
  ceremonyEstimatedDate: DateTime | null;
  ceremonyActualDate: DateTime | null;
}

export class Engagement extends EditableEngagement {
  id: string;
  possibleStatuses: EngagementStatus[];
  language: Language;
  initialEndDate: DateTime | null;
  currentEndDate: DateTime | null;
  updatedAt: DateTime | null;

  static fromJson(json: any): Engagement {
    json = json || {};

    const engagement = new Engagement();

    engagement.id = json.id;
    engagement.status = json.status || EngagementStatus.InDevelopment;
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

  withChanges(modified: Partial<EditableEngagement>): Engagement {
    return Object.assign(clone(this), modified);
  }
}

export const EmptyEngagement = Engagement.fromJson({
  language: {},
});
