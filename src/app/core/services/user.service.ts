import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { ProjectRole } from '../models/project-role';
import { TeamMember } from '../models/team-member';
import { User, UserListItem, UsersWithTotal } from '../models/user';
import { HttpParams } from './http/abstract-http-client';
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

  getUsers(skip = 0, limit = 10): Observable<UsersWithTotal> {
    const params: HttpParams = {
      skip: skip.toString(),
      limit: limit.toString()
    };
    return this
      .plo
      .get<UserListItem[]>('/users', {params, observe: 'response'})
      .map((response: HttpResponse<UserListItem[]>) => {
        return {
          users: response.body!.map(UserListItem.fromJson),
          total: Number(response.headers.get('x-sc-total-count')) || 0
        };
      });
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
