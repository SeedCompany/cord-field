import { Injectable } from '@angular/core';
import { ifValue } from '@app/core/util';
import { listApi } from '@app/core/util/list-views';
import { Observable, of as observableOf } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { ModifiedUser } from '../../people/user-view-state.service';
import { Project } from '../models/project';
import { ProjectRole } from '../models/project-role';
import { TeamMember } from '../models/team-member';
import { NewUser, User, UserFilter, UserListItem, UserProfile, UserRole } from '../models/user';
import { PloApiService } from './http/plo-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private plo: PloApiService) {
  }

  getUser(id: string): Observable<UserProfile> {
    return this.plo
      .get(`/users/${id}`)
      .pipe(
        map(UserProfile.fromJson),
        tap(user => user.id = id), // keep same encrypted ID for identifying previous local changes
      );
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

  // tslint:disable-next-line:member-ordering
  getUsers = listApi(
    this.plo,
    '/users',
    UserListItem.fromJson,
    (filter: UserFilter) => ({
      organizationIds: ifValue(filter.organizations, orgs => orgs.map(org => org.id)),
      isActive: ifValue(filter.isActive, active => active),
    }),
  );

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

  create({ userRoles, ...body }: NewUser): Promise<string> {
    return this.plo.post<{ id: string }>('/users/invite', {
      ...body,
      userRoles: userRoles.map(UserRole.forSaveAPI),
    })
      .pipe(map(result => result.id))
      .toPromise();
  }
}
