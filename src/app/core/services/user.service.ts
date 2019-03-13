import { Injectable } from '@angular/core';
import { ModifiedOrganizations } from '@app/core/models/organization';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { toIds } from '@app/core/util/list-filters';
import { listApi } from '@app/core/util/list-views';
import { Observable, of as observableOf } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Project } from '../models/project';
import { Role } from '../models/role';
import { TeamMember } from '../models/team-member';
import {
  ModifiedEducationList,
  ModifiedKnownLanguages,
  ModifiedUnavailabilities,
  ModifiedUserRoles,
  NewUser,
  User,
  UserFilter,
  UserListItem,
  UserProfile,
  UserRole,
} from '../models/user';
import { PloApiService } from './http/plo-api.service';

export interface ModifiedUser {
  firstName?: string;
  lastName?: string;
  displayFirstName?: string;
  displayLastName?: string;
  email?: string;
  userRoles?: ModifiedUserRoles;
  organizations?: ModifiedOrganizations;
  phone?: string;
  timeZone?: string;
  unavailabilities?: ModifiedUnavailabilities;
  bio?: string;
  education?: ModifiedEducationList;
  skills?: string[];
  knownLanguages?: ModifiedKnownLanguages;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private plo: PloApiService,
              private auth: AuthenticationService) {
  }

  getUser(id: string): Observable<UserProfile> {
    return this.plo
      .get(`/users/${id}`)
      .pipe(
        map(UserProfile.fromJson),
        tap(user => user.id = id), // keep same encrypted ID for identifying previous local changes
      );
  }

  async hasRole(role: Role): Promise<boolean> {

    const user = await this.auth.getCurrentUser();
    const userProfile = await this.getUser(user!.id).toPromise();
    return userProfile.roles.some(userRole => userRole.role === role);
  }

  save(id: string, changes: ModifiedUser): Promise<UserProfile> {
    return this.plo.put<UserProfile>(`/users/${id}/save`, changes).toPromise();
  }

  search(term: string): Promise<User[]> {
    return this.plo
      .get<User[]>('/users/suggestions', { params: { term } })
      .pipe(map(users => users.map(User.fromJson)))
      .toPromise();
  }

  // tslint:disable-next-line:member-ordering
  getUsers = listApi(
    this.plo,
    '/users',
    UserListItem.fromJson,
    ({ isActive, organizations }: UserFilter) => ({
      isActive,
      organizationIds: toIds(organizations),
    }),
  );

  async getAssignableRoles(userId: string, project: Project, teamMember?: TeamMember): Promise<Role[]> {
    const roles = await this.plo
      .get<Role[]>(`/users/${userId}/assignable-roles/${project.location!.id}`)
      .toPromise();

    // Exclude unique roles that are already assigned
    return roles.filter(role => {
      if (!Role.unique.includes(role)) {
        return true;
      }
      return !project.team.find(member =>
        // Don't filter out unique roles for the team member given
        (teamMember ? member.id !== teamMember.id : true)
        && member.roles.includes(role));
    });
  }

  getAssignableRolesForUser(user: User): Promise<Role[]> {
    return observableOf(Role.values()).pipe(delay(2000)).toPromise();
  }

  create({ userRoles, ...body }: NewUser): Observable<string> {
    return this.plo.post<{ id: string }>('/users/invite', {
      ...body,
      userRoles: userRoles.map(UserRole.forSaveAPI),
    })
      .pipe(map(result => result.id));
  }
}
