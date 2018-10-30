import { Language } from '@app/core/models/language';
import { clone } from '@app/core/util';
import { DateTime } from 'luxon';
import { ProjectApproach } from './engagement/approach';
import { ProjectMedium } from './engagement/medium';
import { ProjectProduct } from './engagement/product';

export { ProjectApproach, ProjectMedium, ProjectProduct };

export class Engagement {
  id: string;
  language: Language;
  products: ProjectProduct[];
  mediums: ProjectMedium[];
  approaches: ProjectApproach[];
  tags: string[];
  isDedicationPlanned: boolean;
  dedicationDate: DateTime | null;
  updatedAt: DateTime | null;

  static fromJson(json: any): Engagement {
    json = json || {};

    const engagement = new Engagement();

    engagement.id = json.id;
    engagement.language = Language.fromJson(json.language);
    engagement.products = json.products || [];
    engagement.mediums = json.mediums || [];
    engagement.approaches = json.approaches || [];
    engagement.tags = json.tags || [];
    engagement.isDedicationPlanned = json.isDedicationPlanned || false;
    engagement.dedicationDate = json.dedicationDate ? DateTime.fromISO(json.dedicationDate) : null;
    engagement.updatedAt = json.updatedAt ? DateTime.fromISO(json.updatedAt) : null;

    return engagement;
  }

  withChanges(modified: ModifiedEngagement): Engagement {
    const engagement = clone(this);
    engagement.products = modified.products;
    engagement.mediums = modified.mediums;
    engagement.approaches = modified.approaches;
    engagement.tags = modified.tags;
    engagement.isDedicationPlanned = modified.isDedicationPlanned;
    engagement.dedicationDate = modified.dedicationDate;

    return engagement;
  }
}

export interface ModifiedEngagement {
  products: ProjectProduct[];
  mediums: ProjectMedium[];
  approaches: ProjectApproach[];
  tags: string[];
  isDedicationPlanned: boolean;
  dedicationDate: DateTime | null;
}
