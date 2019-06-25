import { Location } from '@app/core/models/location';
import { ProductMethodology } from '@app/core/models/product';
import { User } from '@app/core/models/user';
import { clone, ifValue, maybeDate, Omit } from '@app/core/util';
import { DateTime } from 'luxon';
import { InternshipEngagementPosition } from './position';
import { InternshipEngagementStatus } from './status';
import { InternshipEngagementTag } from './tag';

export { InternshipEngagementPosition, InternshipEngagementStatus, InternshipEngagementTag };

/**
 * Editable properties of InternshipEngagement.
 * No functions in this class.
 */
export class EditableInternshipEngagement {
  status: InternshipEngagementStatus;
  countryOfOrigin: Location | null;
  mentor: User | null;
  position: InternshipEngagementPosition;
  methodologies: ProductMethodology[];
  tags: InternshipEngagementTag[];
  completeDate: DateTime | null;
  disbursementCompleteDate: DateTime | null;
  communicationsCompleteDate: DateTime | null;
  ceremonyEstimatedDate: DateTime | null;
  ceremonyActualDate: DateTime | null;
}

export type EditableInternshipEngagementForSaveAPI = Omit<EditableInternshipEngagement, 'countryOfOrigin' | 'mentor'> & {
  mentorId: string;
  countryOfOriginId: string;
};

export class InternshipEngagement extends EditableInternshipEngagement {
  id: string;
  intern: User;
  possibleStatuses: InternshipEngagementStatus[];
  initialEndDate: DateTime | null;
  currentEndDate: DateTime | null;
  updatedAt: DateTime | null;

  static fromJson(json: any): InternshipEngagement {
    json = json || {};

    const engagement = new InternshipEngagement();

    engagement.id = json.id;
    engagement.intern = User.fromJson(json.intern);
    engagement.status = json.status || InternshipEngagementStatus.InDevelopment;
    engagement.possibleStatuses = json.possibleStatuses || [];
    engagement.countryOfOrigin = ifValue(json.countryOfOrigin, Location.fromJson, null);
    engagement.mentor = ifValue(json.mentor, User.fromJson, null);
    engagement.position = json.position;
    engagement.methodologies = json.methodologies || [];
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
}

export const EmptyInternshipEngagement = InternshipEngagement.fromJson({
  intern: {},
  mentor: {},
  countryOfOrigin: {},
});
