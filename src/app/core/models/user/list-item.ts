import { Organization } from '@app/core/models/organization';
import { Role } from '@app/core/models/role';
import { User } from './user';

export class UserListItem extends User {
  projectCount: number;
  roles: Role[];
  organizations: Organization[];
  isActive: boolean;

  static fromJson(json: Partial<UserListItem>): UserListItem {
    json = json || {};
    const obj = Object.assign(new UserListItem(), super.fromJson(json));

    obj.projectCount = json.projectCount || 0;
    obj.roles = json.roles || [];
    obj.organizations = (json.organizations || []).map(Organization.fromJson);
    obj.isActive = json.isActive || false;

    return obj;
  }
}

export interface UserFilter {
  organizations?: Organization[];
  isActive?: boolean;
}
