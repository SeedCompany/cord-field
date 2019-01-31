import { DateTime, Interval } from 'luxon';
import { firstLettersOfWords, generateObjectId, isRedacted, Omit } from '../util';
import { buildEnum } from './enum';
import { Language } from './language';
import { Location } from './location';
import { Organization } from './organization';
import { ProjectRole } from './project-role';

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  userRoles: UserRole[];
  sendInvite: boolean;
}

export class User {

  id: string;
  realFirstName: string | null;
  realLastName: string | null;
  displayFirstName: string;
  displayLastName: string;
  email: string | null;

  static store(user: User) {
    return {
      id: user.id,
      firstName: user.realFirstName,
      displayFirstName: user.displayFirstName,
      lastName: user.realLastName,
      displayLastName: user.displayLastName,
      email: user.email,
    };
  }

  get firstName(): string | null {
    return this.isRealNameValid(this.realFirstName) ? this.realFirstName : this.displayFirstName;
  }

  get lastName(): string | null {
    return this.isRealNameValid(this.realLastName) ? this.realLastName : this.displayLastName;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get avatarLetters() {
    return firstLettersOfWords(this.fullName);
  }

  static fromJson(json: any): User {
    const obj = new User();

    obj.id = json.id || '';
    obj.realFirstName = json.firstName;
    obj.displayFirstName = json.displayFirstName || '';
    obj.realLastName = json.lastName;
    obj.displayLastName = json.displayLastName || '';
    obj.email = json.email;

    return obj;
  }

  isRealNameValid(value: string | null): boolean {
    return !isRedacted(value) && !!value;
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

export interface UserFilter {
  organizations?: Organization[];
  isActive?: boolean;
}

export class UserProfile extends User {
  // basic info tab
  roles: UserRole[];
  organizations: Organization[];
  phone: string | null;
  timeZone: string; // TODO what's easiest on FE?
  unavailabilities: Unavailability[];
  picture: string | null;

  // about tab
  bio: string;
  education: Education[];
  skills: string[];
  knownLanguages: KnownLanguage[];

  // Authorization
  isSelf: boolean;

  canEdit = true; // TODO with auth
  canEditRoles: boolean;

  get available(): boolean {
    if (this.unavailabilities.length === 0) {
      return true;
    }

    const today = DateTime.utc();
    return this.unavailabilities.some(u => !u.range.contains(today));
  }

  static fromJson(json: Partial<UserProfile & {userRoles: UserRole[]}>): UserProfile {
    const user = Object.assign(new UserProfile(), super.fromJson(json));

    user.roles = (json.roles || json.userRoles || []).map(UserRole.fromJson);
    user.organizations = (json.organizations || []).map(Organization.fromJson);
    user.phone = json.phone || null;
    user.timeZone = json.timeZone || '';
    user.unavailabilities = (json.unavailabilities || []).map(Unavailability.fromJson);
    user.bio = json.bio || '';
    user.education = (json.education || []).map(Education.fromJson);
    user.skills = json.skills || [];
    user.knownLanguages = (json.knownLanguages || []).map(KnownLanguage.fromJson);
    user.isSelf = json.isSelf || false;
    user.canEditRoles = json.canEditRoles || false;

    return user;
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

  static forSaveAPI(ur: UserRole): UserRoleForSaveAPI {
    return {
      locationIds: ur.locations.map((location) => location.id),
      role: ur.role,
    };
  }

  static restore(ur: UserRole): UserRole {
    return {
      role: ur.role,
      locations: ur.locations.map(Location.fromJson),
    };
  }
}

export interface UserRoleForSaveAPI {
  role: string;
  locationIds: string[];
}

export class KnownLanguage {
  language: Language;
  proficiency: LanguageProficiency;

  get id() {
    return this.language.id;
  }

  static fromJson(json: Partial<KnownLanguage>): KnownLanguage {
    const kl = new KnownLanguage();

    kl.language = Language.fromJson(json.language || {});
    kl.proficiency = json.proficiency || LanguageProficiency.Beginner;

    return kl;
  }

  static forSaveAPI(kl: KnownLanguage): KnownLanguageForSaveAPI {
    return {
      languageId: kl.language.id,
      proficiency: kl.proficiency,
    };
  }
}

export interface KnownLanguageForSaveAPI {
  languageId: string;
  proficiency: LanguageProficiency;
}

export enum LanguageProficiency {
  Beginner = 'beginner',
  Conversational = 'conversational',
  Skilled = 'skilled',
  Fluent = 'fluent',
}

export namespace LanguageProficiency {
  export const { entries, forUI, values, trackEntryBy, trackValueBy } = buildEnum(LanguageProficiency, {
    [LanguageProficiency.Beginner]: 'Beginner',
    [LanguageProficiency.Conversational]: 'Conversational',
    [LanguageProficiency.Skilled]: 'Skilled',
    [LanguageProficiency.Fluent]: 'Fluent',
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
    return Object.assign(new Education(), { id: generateObjectId() });
  }
}

export enum Degree {
  Primary = 'primary',
  Secondary = 'secondary',
  Associates = 'associates',
  Bachelors = 'bachelors',
  Masters = 'masters',
  Doctorate = 'doctorate',
}

export namespace Degree {
  export const { entries, forUI, values, trackEntryBy, trackValueBy } = buildEnum(Degree, {
    [Degree.Primary]: 'Primary',
    [Degree.Secondary]: 'Secondary',
    [Degree.Associates]: 'Associate\'s',
    [Degree.Bachelors]: 'Bachelor\'s',
    [Degree.Masters]: 'Master\'s',
    [Degree.Doctorate]: 'Doctorate',
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
    return Object.assign(new Unavailability(), {
      id: generateObjectId(),
      description: '',
      range: Interval.invalid('Not set'),
    });
  }

  static fromForm({ id, description, start, end }: RawUnavailability) {
    return Object.assign(new Unavailability(), {
      id,
      description,
      range: Interval.fromDateTimes(start, end),
    });
  }

  static forSaveAPI({ id, description, start, end }: Unavailability): RawUnavailability {
    return {
      id,
      description,
      start,
      end,
    };
  }

  static store(un: Unavailability): StoredUnavailability {
    return {
      ...un,
      range: un.range.toISO(),
    };
  }
  static restore(stored: StoredUnavailability): Unavailability {
    return Object.assign(new Unavailability(), {
      ...stored,
      range: Interval.fromISO(stored.range),
    });
  }
}

export type RawUnavailability = Omit<Unavailability, 'range'>;
type StoredUnavailability = Omit<RawUnavailability, 'start' | 'end'> & {range: string};
