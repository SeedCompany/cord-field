import { FieldConfig, mapChangeList, ModifiedList } from '@app/core/change-engine';
import { Location } from '@app/core/models/location';
import { Role } from '@app/core/models/role';

export class UserRole {
  role: Role;
  locations: Location[];

  static fromJson(json: Partial<UserRole>): UserRole {
    const role = new UserRole();

    role.role = json.role!;
    role.locations = (json.locations || []).map(Location.fromJson);

    return role;
  }

  static fieldConfigList = (): FieldConfig<UserRole[], ModifiedUserRoles> => ({
    accessor: (role) => role.role,
    key: 'userRoles',
    toServer: mapChangeList(UserRole.forSaveAPI, ur => ur.role),
    restore: mapChangeList(UserRole.restore, UserRole.restore),
  });

  static forSaveAPI(ur: UserRole): UserRoleForSaveAPI {
    return {
      locationIds: ur.locations.map((location) => location.id),
      role: ur.role,
    };
  }

  static restore(ur: UserRole): UserRole {
    return {
      role: ur.role,
      locations: ur.locations.map(Location.fromJson),
    };
  }
}

export type ModifiedUserRoles = ModifiedList<UserRoleForSaveAPI, Role>;

interface UserRoleForSaveAPI {
  role: Role;
  locationIds: string[];
}
