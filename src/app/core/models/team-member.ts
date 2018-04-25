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

export enum ProjectRole {
  RegionalDirector = 'regional_director',
  AreaDirector = 'area_director',
  FieldCoordinator = 'field_coordinator',
  LeadFinancialAnalyst = 'lead_financial_analyst',
  FinancialAnalyst = 'financial_analyst',
  Consultant = 'consultant'
}


export function projectRoleToString(role: ProjectRole): string {
  const projectRole = {
    [ProjectRole.RegionalDirector]: 'Regional Director',
    [ProjectRole.AreaDirector]: 'Area Director',
    [ProjectRole.FieldCoordinator]: 'Field Coordinator',
    [ProjectRole.LeadFinancialAnalyst]: 'Lead Financial Analyst',
    [ProjectRole.FinancialAnalyst]: 'Financial Analyst',
    [ProjectRole.Consultant]: 'Consultant'
  };

  return projectRole[role];
}
