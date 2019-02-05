import { UserRole } from './user-role';

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  userRoles: UserRole[];
  sendInvite: boolean;
}
