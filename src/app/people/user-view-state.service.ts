import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractViewState, SaveResult } from '../core/abstract-view-state';
import { ChangeConfig, mapChangeList, returnId, returnSelf } from '../core/change-engine';
import { Organization } from '../core/models/organization';
import { ProjectRole } from '../core/models/project-role';
import {
  Education,
  KnownLanguage,
  KnownLanguageForSaveAPI,
  Unavailability,
  UserProfile,
  UserRole
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
    add?: Unavailability[];
    update?: Unavailability[];
    remove?: string[];
  };
  bio?: string;
  education?: {
    add?: Education[];
    update?: Education[];
    remove?: string[];
  };
  skills?: {
    add?: string[];
    remove?: string[];
  };
  customSkills?: {
    add?: string[];
    remove?: string[];
  };
  knownLanguages?: {
    add?: KnownLanguageForSaveAPI[];
    update?: KnownLanguageForSaveAPI[];
    remove?: string[];
  };
}

const config: ChangeConfig<UserProfile> = {
  realFirstName: {
    key: 'firstName'
  },
  realLastName: {
    key: 'lastName'
  },
  displayFirstName: {},
  displayLastName: {},
  email: {},
  roles: {},
  organizations: {
    accessor: returnId,
    toServer: mapChangeList<Organization, string, string>(returnId, returnId)
  },
  phone: {},
  timeZone: {},
  unavailabilities: {
    accessor: returnId,
    toServer: mapChangeList<Unavailability, string, string>(returnSelf, returnId)
  },
  bio: {},
  education: {
    accessor: returnId,
    toServer: mapChangeList<Education, string, string>(returnSelf, returnId)
  },
  skills: {},
  customSkills: {},
  knownLanguages: {
    accessor: returnId,
    toServer: mapChangeList<KnownLanguage, KnownLanguageForSaveAPI, string>(KnownLanguage.forSaveAPI, returnId)
  }
};

@Injectable()
export class UserViewStateService extends AbstractViewState<UserProfile> {

  constructor(private userService: UserService) {
    super(config, UserProfile.fromJson({}));
  }

  get user(): Observable<UserProfile> {
    return this.subject;
  }

  next(id: string): void {
    this.userService.getUser(id)
      .subscribe(this.onLoad);
  }

  protected onSave(user: UserProfile, changes: ModifiedUser): Promise<SaveResult<UserProfile>> {
    return this.userService.save(user.id, changes);
  }

  protected refresh(user: UserProfile): void {
    this.next(user.id);
  }
}
