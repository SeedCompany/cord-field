import { ObjectId } from './object-id';

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
    const results = [];
    if (!Array.isArray(jsons)) {
      for (const json of jsons) {
        results.push(Address.fromJson(json));
      }
    }
    return results;
  }

  constructor() {
  }
}

export class BillingDetails {

  brand: string;
  expiresMonth: number;
  expiresYear: number;
  last4: string;
  name: string;

  static fromJson(json: any): BillingDetails {
    json = json || {};

    const obj = new BillingDetails();

    obj.brand = json.brand || '';
    obj.expiresMonth = json.expiresMonth || '';
    obj.expiresYear = json.expiresYear || '';
    obj.last4 = json.last4 || '';
    obj.name = json.name || '';

    return obj;
  }

}

export class User {

  id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mailingAddress?: Address;
  billingAddress?: Address;
  billingDetails?: BillingDetails;

  static fromJson(json: any): User {
    json = json || {};

    const obj = new User();

    obj.id = json.id;
    obj.firstName = json.firstName;
    obj.lastName = json.lastName;
    obj.email = json.email;
    obj.phone = json.phone;
    obj.mailingAddress = Address.fromJson(json.mailingAddress);
    obj.billingAddress = Address.fromJson(json.billingAddress);
    obj.billingDetails = BillingDetails.fromJson(json.billingDetails);

    return obj;
  }

  static fromJsonArray(jsons: any[]): User[] {
    const results = [];
    if (!Array.isArray(jsons)) {
      for (const json of jsons) {
        results.push(User.fromJson(json));
      }
    }
    return results;
  }

  get fullName(): string {
    return `${this.firstName || ''}${this.lastName && this.lastName !== '' ? ' ' : ''}${this.lastName || ''}`;
  }

  get created(): Date {
    return (this.id || {} as any).timeStamp || null;
  }

  constructor() {
  }

}
