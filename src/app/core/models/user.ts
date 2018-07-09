import { DateTime, Interval } from 'luxon';
import { buildEnum } from './enum';
import { Language } from './language';
import { Location } from './location';
import { Organization } from './organization';
import { ProjectRole } from './project-role';
import { firstLettersOfWords, generateObjectId, maybeRedacted } from './util';

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

  get avatarLetters() {
    return firstLettersOfWords(this.fullName);
  }
}

export class UserListItem extends User {
  projectCount: number;
  roles: ProjectRole[];
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
  readonly id: string;
  degree: Degree;
  major: string;
  institution: string;

  static fromJson(json: Education): Education {
    return Object.assign(new Education(), json);
  }

  static create(): Education {
    return Object.assign(new Education(), {id: generateObjectId()});
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
  readonly id: string;
  description: string;
  range: Interval;

  get start() {
    return this.range.start;
  }

  get end() {
    return this.range.end;
  }

  static fromJson(json: Partial<Record<keyof Unavailability, any>>): Unavailability {
    const obj = new Unavailability();

    // @ts-ignore readonly property
    obj.id = json.id;
    obj.description = json.description || '';
    obj.range = json.start && json.end
      ? Interval.fromDateTimes(DateTime.fromISO(json.start), DateTime.fromISO(json.end))
      : Interval.invalid('Missing start or end');

    return obj;
  }

  static create(): Unavailability {
    return Object.assign(new Unavailability(), {id: generateObjectId()});
  }
}
