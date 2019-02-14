import { Injectable } from '@angular/core';
import { SessionStorageService } from '@app/core/services/storage.service';
import { RecordOfType } from '@app/core/util';
import { differenceBy } from 'lodash';
import { Observable } from 'rxjs';

import { AbstractViewState, SaveResult } from '../core/abstract-view-state';
import { ChangeConfig } from '../core/change-engine';
import { Organization } from '../core/models/organization';
import { Education, KnownLanguage, Unavailability, UserProfile, UserRole } from '../core/models/user';
import { ModifiedUser, UserService } from '../core/services/user.service';

const config: ChangeConfig<UserProfile> = {
  realFirstName: {
    key: 'firstName',
  },
  realLastName: {
    key: 'lastName',
  },
  displayFirstName: {},
  displayLastName: {},
  email: {
    toServer: email => email ? email.toLowerCase() : undefined,
  },
  roles: UserRole.fieldConfigList(),
  organizations: Organization.fieldConfigList(),
  phone: {},
  timeZone: {},
  unavailabilities: Unavailability.fieldConfigList(),
  bio: {},
  education: Education.fieldConfigList(),
  skills: {},
  knownLanguages: KnownLanguage.fieldConfigList(),
};

// Sub type of User that only has properties that are lists of objects with IDs
type UserOnlyObjectLists = RecordOfType<UserProfile, Array<{id: string}>>;

@Injectable()
export class UserViewStateService extends AbstractViewState<UserProfile, ModifiedUser> {

  constructor(
    storage: SessionStorageService,
    private userService: UserService,
  ) {
    super(config, UserProfile.fromJson({}), storage);
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

  protected identify(user: UserProfile): string {
    return `user-${user.id}`;
  }
}
