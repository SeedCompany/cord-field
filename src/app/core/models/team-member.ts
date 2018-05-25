import { ProjectRole } from './project-role';
import { User } from './user';

export interface TeamMemberForSaveAPI {
  userId: string;
  roles: ProjectRole[];
}

export class TeamMember {
  user: User;
  roles: ProjectRole[];
  description: string;
  editable: boolean;
  dateAdded: Date;

  static fromJson(json: any): TeamMember {
    json = json || {};

    const teamMember = new TeamMember();
    teamMember.user = User.fromJson(json.user);
    teamMember.roles = json.roles;
    teamMember.description = json.description || '';
    teamMember.editable = json.editable || false;
    teamMember.dateAdded = new Date(json.dateAdded);

    return teamMember;
  }

  static forSaveAPI(member: TeamMember): TeamMemberForSaveAPI {
    return {
      userId: member.id,
      roles: member.roles
    };
  }

  get id() {
    return this.user.id!;
  }

  get firstName() {
    return this.user.publicFirstName;
  }

  get lastName() {
    return this.user.publicLastName;
  }

  get removable() {
    return this.roles.some(role => ProjectRole.implicit.includes(role));
  }
}
