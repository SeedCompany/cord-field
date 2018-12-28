import { Language } from '@app/core/models/language';
import { Product } from '@app/core/models/product';
import { clone } from '@app/core/util';
import { DateTime } from 'luxon';
import { EngagementStatus } from './engagement/status';

export { EngagementStatus };

export class Engagement {
  id: string;
  status: EngagementStatus;
  possibleStatuses: EngagementStatus[];
  language: Language;
  products: Product[];
  tags: string[];
  isDedicationPlanned: boolean;
  dedicationDate: DateTime | null;
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
    engagement.isDedicationPlanned = json.isDedicationPlanned || false;
    engagement.dedicationDate = json.dedicationDate ? DateTime.fromISO(json.dedicationDate) : null;
    engagement.updatedAt = json.updatedAt ? DateTime.fromISO(json.updatedAt) : null;

    return engagement;
  }

  withChanges(modified: ModifiedEngagement): Engagement {
    return Object.assign(clone(this), modified);
  }
}

export interface ModifiedEngagement {
  status: EngagementStatus;
  products: Product[];
  tags: string[];
  isDedicationPlanned: boolean;
  dedicationDate: DateTime | null;
}
