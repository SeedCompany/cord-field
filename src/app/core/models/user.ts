import { Location } from './location';
import { ObjectId } from './object-id';
import { ProjectRole } from './project-role';


export interface IUserRequestAccess {
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  password: string;
}

export class User {

  id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mailingAddress?: Address;
  assignableRoles: AssignableRole[];
  authRoles: string[];
  imgSrc: string;

  static fromJson(json: any): User {
    json = json || {};

    const obj = new User();

    obj.id = json.id;
    obj.firstName = json.firstName;
    obj.lastName = json.lastName;
    obj.email = json.email;
    obj.phone = json.phone;
    obj.mailingAddress = Address.fromJson(json.mailingAddress);
    obj.assignableRoles = AssignableRole.fromJsonArray(json.roles);
    obj.authRoles = json.authRoles || [];
    obj.imgSrc = json.imgSrc || '';

    return obj;
  }

  static fromJsonArray(jsons: any[]): User[] {
    return jsons.map(json => User.fromJson(json));
  }

  get fullName(): string {
    return `${this.firstName || ''}${this.lastName && this.lastName !== '' ? ' ' : ''}${this.lastName || ''}`;
  }

  get created(): Date {
    return (this.id || {} as any).timeStamp || null;
  }
}

export class Address {

  address1: string;
  address2: string;
  city: string;
  country: string;
  state: string;
  zip: string;

  static fromJson(json: any): Address {
    json = json || {};

    const obj = new Address();

    obj.address1 = json.address1 || json.addressLine1 || '';
    obj.address2 = json.address2 || json.addressLine2 || '';
    obj.city = json.city || json.addressCity || '';
    obj.country = json.country || '';
    obj.state = json.state || json.addressState || '';
    obj.zip = json.zip || json.addressZip || '';

    return obj;
  }

  static fromJsonArray(jsons: any[]): Address[] {
    return jsons.map(json => Address.fromJson(json));
  }

  constructor() {
  }
}

export class AssignableRole {
  role: ProjectRole;
  location: Location;

  static fromJson(json: any): AssignableRole {
    json = json || {};

    const assignableRole = new AssignableRole();
    assignableRole.role = json.role || null;
    assignableRole.location = Location.fromJson(json.location);

    return assignableRole;
  }

  static fromJsonArray(jsons: any[]): AssignableRole[] {
    return jsons.map(json => AssignableRole.fromJson(json));
  }
}
