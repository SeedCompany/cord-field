import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import { Observable, of as observableOf } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ModifiedUser } from '../../people/user-view-state.service';
import { Project } from '../models/project';
import { ProjectRole } from '../models/project-role';
import { TeamMember } from '../models/team-member';
import { NewUser, User, UserFilter, UserListItem, UserProfile, UsersWithTotal } from '../models/user';
import { HttpParams } from './http/abstract-http-client';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private plo: PloApiService) {
  }

  getUser(id: string): Observable<UserProfile> {
    return this.plo
      .get(`/users/${id}`)
      .pipe(map(UserProfile.fromJson));
  }

  save(id: string, changes: ModifiedUser): Promise<UserProfile> {
    return this.plo.put<UserProfile>(`/users/${id}/save`, changes).toPromise();
  }

  search(term: string): Promise<User[]> {
    return this.plo
      .get<User[]>('/users/suggestions', {params: {term}})
      .pipe(map(users => users.map(User.fromJson)))
      .toPromise();
  }

  getUsers(
    sort?: keyof UserListItem,
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
      .pipe(map((response: HttpResponse<UserListItem[]>) => {
        return {
          users: response.body!.map(UserListItem.fromJson),
          total: Number(response.headers.get('x-sc-total-count')) || 0
        };
      }));
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

  getAssignableRolesForUser(user: User): Promise<ProjectRole[]> {
    return observableOf(ProjectRole.values()).pipe(delay(2000)).toPromise();
  }

  create(newUser: NewUser): Promise<string> {
    return this.plo.post<{ id: string }>('/users/invite', newUser)
      .pipe(map(result => result.id))
      .toPromise();
  }
}
