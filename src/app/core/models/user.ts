import { DateTime } from 'luxon';
import { buildEnum } from './enum';
import { Language } from './language';
import { Location } from './location';
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

export class UserProfile extends User {
  // basic info tab
  roles: UserRole[];
  organizations: Organization[];
  phone: string | null;
  timeZone: string; // TODO what's easiest on FE?
  unavailabilities: Unavailability[];

  // about tab
  bio: string;
  education: Education[];
  skills: string[]; // predefined chip list
  customSkills: string[]; // free form chip list
  knownLanguages: KnownLanguage[];

  // Authorization
  isSelf: boolean;

  static fromJson(json: Partial<UserProfile>): UserProfile {
    const user = Object.assign(new UserProfile(), super.fromJson(json));

    user.roles = (json.roles || []).map(UserRole.fromJson);
    user.organizations = (json.organizations || []).map(Organization.fromJson);
    user.phone = json.phone || null;
    user.timeZone = json.timeZone || '';
    user.unavailabilities = (json.unavailabilities || []).map(Unavailability.fromJson);
    user.bio = json.bio || '';
    user.education = (json.education || []).map(Education.fromJson);
    user.skills = json.skills || [];
    user.customSkills = json.customSkills || [];
    user.knownLanguages = (json.knownLanguages || []).map(KnownLanguage.fromJson);
    user.isSelf = json.isSelf || false;

    return user;
  }

  get available(): boolean {
    return false; // TODO
  }
}

export class UserRole {
  role: ProjectRole;
  locations: Location[];

  static fromJson(json: Partial<UserRole>): UserRole {
    const role = new UserRole();

    role.role = json.role!;
    role.locations = (json.locations || []).map(Location.fromJson);

    return role;
  }
}

export class KnownLanguage {
  language: Language;
  proficiency: LanguageProficiency;

  static fromJson(json: Partial<KnownLanguage>): KnownLanguage {
    const kl = new KnownLanguage();

    kl.language = Language.fromJson(json.language || {});
    kl.proficiency = json.proficiency || LanguageProficiency.Beginner;

    return kl;
  }

  static forSaveAPI(kl: KnownLanguage): KnownLanguageForSaveAPI {
    return {
      languageId: kl.language.id,
      proficiency: kl.proficiency
    };
  }

  get id() {
    return this.language.id;
  }
}

export interface KnownLanguageForSaveAPI {
  languageId: string;
  proficiency: LanguageProficiency;
}

export enum LanguageProficiency {
  Beginner = 'b',
  Conversational = 'c',
  Fluent = 'f'
}
export namespace LanguageProficiency {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(LanguageProficiency, {
    [LanguageProficiency.Beginner]: 'Beginner',
    [LanguageProficiency.Conversational]: 'Conversational',
    [LanguageProficiency.Fluent]: 'Fluent'
  });
}

export class Education {
  id: string;
  degree: Degree;
  major: string;
  institution: string;

  static fromJson(json: Education): Education {
    return Object.assign(new Education(), json);
  }
}

export enum Degree {
  Primary = 'p',
  Secondary = 's',
  Associates = 'a',
  Bachelors = 'b',
  Masters = 'm',
  Doctorate = 'd'
}
export namespace Degree {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(Degree, {
    [Degree.Primary]: 'Primary',
    [Degree.Secondary]: 'Secondary',
    [Degree.Associates]: 'Associates',
    [Degree.Bachelors]: 'Bachelors',
    [Degree.Masters]: 'Masters',
    [Degree.Doctorate]: 'Doctorate'
  });
}

export class Unavailability {
  id: string;
  description: string;
  start: DateTime;
  end: DateTime;

  static fromJson(json: Partial<Record<keyof Unavailability, any>>): Unavailability {
    const obj = new Unavailability();

    obj.id = json.id;
    obj.description = json.description || '';
    obj.start = json.start ? DateTime.fromISO(json.start) : DateTime.invalid('Missing');
    obj.end = json.end ? DateTime.fromISO(json.end) : DateTime.invalid('Missing');

    return obj;
  }
}
