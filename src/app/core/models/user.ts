import { Location } from './location';
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

  id: string | null;
  firstName: string | null;
  lastName: string | null;
  displayFirstName: string;
  displayLastName: string;
  email: string | null;
  assignableRoles: AssignableRole[];

  static fromJson(json: any): User {
    json = json || {};

    const obj = new User();

    obj.id = json.id !== REDACTED ? json.id : null;
    obj.firstName = json.firstName !== REDACTED ? json.firstName : null;
    obj.displayFirstName = json.displayFirstName;
    obj.lastName = json.lastName !== REDACTED ? json.lastName : null;
    obj.displayLastName = json.displayLastName;
    obj.email = json.email !== REDACTED ? json.email : null;
    obj.assignableRoles = (json.assignableRoles || []).map(AssignableRole.fromJson);

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

export class AssignableRole {
  role: ProjectRole;
  location: Location;

  static fromJson(json: any): AssignableRole {
    const assignableRole = new AssignableRole();

    assignableRole.role = json.role;
    assignableRole.location = Location.fromJson(json.location);

    return assignableRole;
  }
}
