import { ProjectRole } from './project-role';
import { User } from './user';

export class TeamMember {
  user: User;
  roles: ProjectRole[];
  description: string;
  editable: boolean;
  updatedAt: Date;

  static fromJson(json: any): TeamMember {
    json = json || {};

    const teamMember = new TeamMember();
    teamMember.user = User.fromJson(json.user);
    teamMember.roles = json.roles;
    teamMember.description = json.description || '';
    teamMember.editable = json.editable || false;
    teamMember.updatedAt = new Date(json.updatedAt);

    return teamMember;
  }

  get id() {
    return this.user.id;
  }

  get firstName() {
    return this.user.publicFirstName;
  }

  get lastName() {
    return this.user.publicLastName;
  }
}
