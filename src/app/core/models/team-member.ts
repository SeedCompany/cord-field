import { DateTime } from 'luxon';
import { clone } from '../util';
import { Role } from './role';
import { User } from './user';

export interface TeamMemberForSaveAPI {
  userId: string;
  roles: Role[];
}

export class TeamMember {
  user: User;
  roles: Role[];
  description: string;
  editable: boolean;
  dateAdded: DateTime | null; // Nullable until CF2-512 is resolved

  static fromJson(json: any): TeamMember {
    json = json || {};

    const teamMember = new TeamMember();
    teamMember.user = User.fromJson(json.user);
    teamMember.roles = json.roles;
    teamMember.description = json.description || '';
    teamMember.editable = json.editable || false;
    teamMember.dateAdded = json.dateAdded ? DateTime.fromISO(json.dateAdded) : null;

    return teamMember;
  }

  static new(user: User, roles: Role[]): TeamMember {
    const member = new TeamMember();
    member.user = user;
    member.roles = roles;
    member.description = '';
    member.editable = true;
    member.dateAdded = DateTime.local();

    return member;
  }

  static forSaveAPI(member: TeamMember): TeamMemberForSaveAPI {
    return {
      userId: member.id,
      roles: member.roles,
    };
  }

  static store(tm: TeamMember) {
    return {
      ...tm,
      user: User.store(tm.user),
      dateAdded: tm.dateAdded ? tm.dateAdded.toISO() : null,
    };
  }

  get id() {
    return this.user.id;
  }

  get firstName() {
    return this.user.firstName;
  }

  get lastName() {
    return this.user.lastName;
  }

  get avatarLetters() {
    return this.user.avatarLetters;
  }

  get removable() {
    return this.roles.some(role => Role.implicit.includes(role));
  }

  withRoles(roles: Role[]): TeamMember {
    const cloned = clone(this);
    cloned.roles = roles;

    return cloned;
  }
}
