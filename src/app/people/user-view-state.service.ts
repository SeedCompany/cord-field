import { Injectable } from '@angular/core';
import { RecordOfType } from '@app/core/util';
import { differenceBy } from 'lodash';
import { Observable } from 'rxjs';

import { AbstractViewState, SaveResult } from '../core/abstract-view-state';
import { ChangeConfig, mapChangeList, returnId, returnSelf } from '../core/change-engine';
import { Organization } from '../core/models/organization';
import { ProjectRole } from '../core/models/project-role';
import {
  Education,
  KnownLanguage,
  KnownLanguageForSaveAPI,
  RawUnavailability,
  Unavailability,
  UserProfile,
  UserRole,
  UserRoleForSaveAPI,
} from '../core/models/user';
import { UserService } from '../core/services/user.service';

export interface ModifiedUser {
  firstName?: string;
  lastName?: string;
  displayFirstName?: string;
  displayLastName?: string;
  email?: string;
  roles?: {
    add?: UserRole[];
    update?: UserRole[];
    remove?: ProjectRole[];
  };
  organizations: {
    add?: string[];
    remove?: string[];
  };
  phone?: string;
  timeZone?: string;
  unavailabilities?: {
    add?: RawUnavailability[];
    update?: RawUnavailability[];
    remove?: string[];
  };
  bio?: string;
  education?: {
    add?: Education[];
    update?: Education[];
    remove?: string[];
  };
  skills?: string[];
  knownLanguages?: {
    add?: KnownLanguageForSaveAPI[];
    update?: KnownLanguageForSaveAPI[];
    remove?: string[];
  };
}

const config: ChangeConfig<UserProfile> = {
  realFirstName: {
    key: 'firstName',
  },
  realLastName: {
    key: 'lastName',
  },
  displayFirstName: {},
  displayLastName: {},
  email: {},
  roles: {
    accessor: (role) => role.role,
    toServer: mapChangeList<UserRole, UserRoleForSaveAPI, string>(UserRole.forSaveAPI, returnSelf),
  },
  organizations: {
    accessor: returnId,
    toServer: mapChangeList<Organization, string, string>(returnId, returnId),
  },
  phone: {},
  timeZone: {},
  unavailabilities: {
    accessor: returnId,
    toServer: mapChangeList<Unavailability, RawUnavailability, string>(Unavailability.forSaveAPI, returnId),
  },
  bio: {},
  education: {
    accessor: returnId,
    toServer: mapChangeList<Education, string, string>(returnSelf, returnId),
  },
  skills: {},
  knownLanguages: {
    accessor: returnId,
    toServer: mapChangeList<KnownLanguage, KnownLanguageForSaveAPI, string>(KnownLanguage.forSaveAPI, returnId),
  },
};

// Sub type of User that only has properties that are lists of objects with IDs
type UserOnlyObjectLists = RecordOfType<UserProfile, Array<{id: string}>>;

@Injectable()
export class UserViewStateService extends AbstractViewState<UserProfile> {

  constructor(private userService: UserService) {
    super(config, UserProfile.fromJson({}));
  }

  get user(): Observable<UserProfile> {
    return this.subject;
  }

  get userWithChanges(): Observable<UserProfile> {
    return this.subjectWithChanges;
  }

  next(id: string): void {
    this.userService.getUser(id)
      .subscribe(this.onLoad);
  }

  protected async onSave(user: UserProfile, changes: ModifiedUser): Promise<SaveResult<UserProfile>> {
    const newUser = await this.userService.save(user.id, changes);

    return this.calculateSaveResult(user, newUser);
  }

  private calculateSaveResult(origUser: UserOnlyObjectLists, newUser: UserOnlyObjectLists): SaveResult<UserProfile> {
    const newIds: SaveResult<UserProfile> = {};

    const keys: Array<keyof UserOnlyObjectLists> = ['education', 'knownLanguages', 'unavailabilities'];
    for (const key of keys) {
      const accessor = config[key]!.accessor as (item: any) => string;
      newIds[key] = differenceBy(newUser[key], origUser[key], accessor).map(accessor);
    }

    return newIds;
  }

  protected refresh(user: UserProfile): void {
    this.next(user.id);
  }
}
