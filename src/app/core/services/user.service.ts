import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import { ProjectRole } from '../models/project-role';
import { TeamMember } from '../models/team-member';
import { User } from '../models/user';
import { PloApiService } from './http/plo-api.service';

@Injectable()
export class UserService {

  constructor(private plo: PloApiService) {
  }

  search(term: string): Promise<User[]> {
    return this.plo
      .get<User[]>('/users/suggestions', {params: {term}})
      .map(users => users.map(User.fromJson))
      .toPromise();
  }

  async getAssignableRoles(userId: string, project: Project, teamMember?: TeamMember): Promise<ProjectRole[]> {
    const roles = await this.plo
      .get<ProjectRole[]>(`/users/${userId}/assignable-roles/${project.location!.id}`)
      .toPromise();

    // Exclude unique roles that are already assigned
    return roles.filter(role => {
      if (!ProjectRole.unique.includes(role)) {
        return true;
      }
      return !project.team.find(member =>
        // Don't filter out unique roles for the team member given
        (teamMember ? member.id !== teamMember.id : true)
        && member.roles.includes(role));
    });
  }
}
