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

export interface UserRoleForSaveAPI {
  role: string;
  locationIds: string[];
}
