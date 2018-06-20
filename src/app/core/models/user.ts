import { Organization } from './organization';
import { ProjectRole } from './project-role';
import { REDACTED } from './util';

export interface IUserRequestAccess {
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  password: string;
}

export class User {

  id: string;
  firstName: string | null;
  lastName: string | null;
  displayFirstName: string;
  displayLastName: string;
  email: string | null;

  static fromJson(json: any): User {
    json = json || {};

    const obj = new User();

    obj.id = json.id !== REDACTED ? json.id : null;
    obj.firstName = json.firstName !== REDACTED ? json.firstName : null;
    obj.displayFirstName = json.displayFirstName;
    obj.lastName = json.lastName !== REDACTED ? json.lastName : null;
    obj.displayLastName = json.displayLastName;
    obj.email = json.email !== REDACTED ? json.email : null;

    return obj;
  }

  get publicFirstName(): string {
    return this.firstName || this.displayFirstName;
  }

  get publicLastName(): string {
    return this.lastName || this.displayLastName;
  }

  get fullName(): string {
    return `${this.publicFirstName} ${this.publicLastName}`.trim();
  }
}

export class UserListItem extends User {
  projectCount: number;
  roles: ProjectRole[];
  organization: Organization;
  isActive: boolean;

  static fromJson(json: any): UserListItem {
    json = json || {};
    const obj = Object.assign(new UserListItem(), User.fromJson(json));

    obj.projectCount = json.projectCount || 0;
    obj.roles = json.roles;
    obj.organization = Organization.fromJson(json.organization || {});
    obj.isActive = json.isActive;

    return obj;
  }
}

export interface UsersWithTotal {
  users: UserListItem[];
  total: number;
}
