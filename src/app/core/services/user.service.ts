import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ModifiedUser } from '../../people/user-view-state.service';
import { SaveResult } from '../abstract-view-state';
import { Project } from '../models/project';
import { ProjectRole } from '../models/project-role';
import { TeamMember } from '../models/team-member';
import { User, UserListItem, UserProfile, UsersWithTotal } from '../models/user';
import { HttpParams } from './http/abstract-http-client';
import { PloApiService } from './http/plo-api.service';

@Injectable()
export class UserService {

  private _userProfile = new Subject<UserProfile>();

  get userProfile$(): Observable<UserProfile> {
    return this._userProfile.asObservable();
  }

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
    limit = 10
  ): Observable<UsersWithTotal> {
    const params: HttpParams = {
      skip: skip.toString(),
      limit: limit.toString()
    };
    if (sort) {
      params.sort = sort;
      params.order = order;
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

  async getUserProfile(id: string): Promise<UserProfile> {
    const user = await this.plo.get<UserProfile>(`/users/${id}`).toPromise();
    const userProfile = UserProfile.fromJson(user);
    this._userProfile.next(userProfile);
    return userProfile;
  }
}
