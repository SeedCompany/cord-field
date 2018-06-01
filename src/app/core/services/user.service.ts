import { Injectable } from '@angular/core';
import { ProjectRole } from '../models/project-role';
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

  getAssignableRoles(userId: string, locationId: string): Promise<ProjectRole[]> {
    return this.plo
      .get<ProjectRole[]>(`/users/${userId}/assignable-roles/${locationId}`)
      .toPromise();
  }

}
