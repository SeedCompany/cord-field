import { GQLOperations } from '../../api';

export * from './Authentication';
export * from './useAuthRequired';

export const SensitiveOperations = [
  GQLOperations.Mutation.Login,
  GQLOperations.Mutation.ResetPassword,
  GQLOperations.Mutation.ChangePassword,
  GQLOperations.Mutation.Register,
];
