import { Organization } from '@app/core/models/organization';
import { DateTime } from 'luxon';
import { Education } from './education';
import { KnownLanguage } from './known-language';
import { Unavailability } from './unavailability';
import { User } from './user';
import { UserRole } from './user-role';

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

  static fromJson(json: Partial<UserProfile & { userRoles: UserRole[] }>): UserProfile {
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
