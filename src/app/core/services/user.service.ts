import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ModifiedUser } from '../../people/user-view-state.service';
import { SaveResult } from '../abstract-view-state';
import { Project } from '../models/project';
import { ProjectRole } from '../models/project-role';
import { TeamMember } from '../models/team-member';
import { User, UserFilter, UserListItem, UserProfile, UsersWithTotal } from '../models/user';
import { HttpParams } from './http/abstract-http-client';
import { PloApiService } from './http/plo-api.service';

@Injectable()
export class UserService {

  constructor(private plo: PloApiService) {
  }

  getUser(id: string): Observable<UserProfile> {
    return this.plo
      .get(`/users/${id}`)
      .map(UserProfile.fromJson);
  }

  save(id: string, changes: ModifiedUser): Promise<SaveResult<UserProfile>> {
    return this.plo.post<SaveResult<UserProfile>>(`/users/${id}/save`, changes).toPromise();
  }

  search(term: string): Promise<User[]> {
    return this.plo
      .get<User[]>('/users/suggestions', {params: {term}})
      .map(users => users.map(User.fromJson))
      .toPromise();
  }

  getUsers(
    // tslint:disable-next-line:no-unnecessary-initializer
    sort: keyof UserListItem | undefined = undefined,
    order: SortDirection = 'desc',
    skip = 0,
    limit = 10,
    filters: UserFilter = {}
  ): Observable<UsersWithTotal> {
    const params: HttpParams = {
      skip: skip.toString(),
      limit: limit.toString()
    };
    if (sort) {
      params.sort = sort;
      params.order = order;
    }

    if (filters && Object.keys(filters).length > 0) {
      const filtersAPI = {
        organizationIds: filters.organizations ? filters.organizations.map(org => org.id) : undefined,
        isActive: 'isActive' in filters ? filters.isActive : undefined
      };
      params.filter = JSON.stringify(filtersAPI);
    }

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
