import { Organization } from './organization';
import { ProjectRole } from './project-role';
import { maybeRedacted } from './util';

export interface IUserRequestAccess {
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  password: string;
}

export class User {

  id: string;
  realFirstName: string | null;
  realLastName: string | null;
  displayFirstName: string;
  displayLastName: string;
  email: string | null;

  static fromJson(json: any): User {
    const obj = new User();

    obj.id = json.id || '';
    obj.realFirstName = maybeRedacted(json.firstName);
    obj.displayFirstName = json.displayFirstName || '';
    obj.realLastName = maybeRedacted(json.lastName);
    obj.displayLastName = json.displayLastName || '';
    obj.email = maybeRedacted(json.email);

    return obj;
  }

  get firstName(): string {
    return this.realFirstName || this.displayFirstName;
  }

  get lastName(): string {
    return this.realLastName || this.displayLastName;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

export class UserListItem extends User {
  projectCount: number;
  roles: ProjectRole[];
  organization: Organization | null;
  isActive: boolean;

  static fromJson(json: Partial<UserListItem>): UserListItem {
    json = json || {};
    const obj = Object.assign(new UserListItem(), super.fromJson(json));

    obj.projectCount = json.projectCount || 0;
    obj.roles = json.roles || [];
    obj.organization = json.organization ? Organization.fromJson(json.organization) : null;
    obj.isActive = json.isActive || false;

    return obj;
  }
}

export interface UsersWithTotal {
  users: UserListItem[];
  total: number;
}
