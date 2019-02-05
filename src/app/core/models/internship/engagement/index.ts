import { Location } from '@app/core/models/location';
import { User } from '@app/core/models/user';
import { clone, maybeDate } from '@app/core/util';
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
  countryOfOrigin: Location;
  mentor: User;
  position: InternshipEngagementPosition;
  status: InternshipEngagementStatus;
  tags: InternshipEngagementTag[];
  completeDate: DateTime | null;
  disbursementCompleteDate: DateTime | null;
  communicationsCompleteDate: DateTime | null;
  ceremonyEstimatedDate: DateTime | null;
  ceremonyActualDate: DateTime | null;
}

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
    engagement.intern  = User.fromJson(json.intern);
    engagement.status = json.status || InternshipEngagementStatus.InDevelopment;
    engagement.possibleStatuses = json.possibleStatuses || [];
    engagement.countryOfOrigin = Location.fromJson(json.countryOfOrigin);
    engagement.mentor = User.fromJson(json.mentor);
    engagement.position = json.position;
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

  withChanges(modified: Partial<EditableInternshipEngagement>): InternshipEngagement {
    return Object.assign(clone(this), modified);
  }
}

export const EmptyInternshipEngagement = InternshipEngagement.fromJson({
  intern: {},
  mentor: {},
  countryOfOrigin: {},
});
