import { ProjectRole } from './project-role';
import { User } from './user';

export class TeamMember {
  id: string;
  user: User;
  role: ProjectRole[];
  description: string;
  editable: boolean;
  updatedAt: Date | null;


  static fromJson(json: any): TeamMember {
    json = json || {};

    const teamMember = new TeamMember();
    teamMember.id = json.id;
    teamMember.description = json.description || '';
    teamMember.editable = json.editable || false;
    teamMember.user = User.fromJson(json.user);
    teamMember.role = json.role || null;
    teamMember.updatedAt = json.updatedAt ? new Date(json.updatedAt) : null;

    return teamMember;
  }

  static fromJsonArray(teamMembers: any): TeamMember[] {
    teamMembers = teamMembers || [];
    return teamMembers.map(TeamMember.fromJson);
  }
}
