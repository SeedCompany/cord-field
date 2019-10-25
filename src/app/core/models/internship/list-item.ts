import { User } from '@app/core/models/user';
import { maybeServerDateTime } from '@app/core/util';
import { DateTime } from 'luxon';
import { InternshipStatus } from './status';

export class InternshipListItem {
  id: string;
  name: string;
  updatedAt: DateTime;
  status: InternshipStatus;
  interns: User[];

  static fromJson(json: any | Partial<InternshipListItem>): InternshipListItem {
    return Object.assign(new InternshipListItem(), {
      id: json.id,
      name: json.name,
      updatedAt: maybeServerDateTime(json.updatedAt) || DateTime.fromMillis(0),
      status: json.status,
      interns: (json.interns || []).map(User.fromJson),
    });
  }
}
