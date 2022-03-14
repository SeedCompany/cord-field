import { GQLOperations } from '../../api';

export * from './AuthLayout';
export * from './AuthWaiting';
export * from './ChangePassword';
export * from './ForgotPassword';
export * from './Login/Login';
export * from './Logout';
export * from './Register/Register';
export * from './ResetPassword';
export * from './useAuthRequired';

export const SensitiveOperations = [
  GQLOperations.Mutation.Login,
  GQLOperations.Mutation.ResetPassword,
  GQLOperations.Mutation.ChangePassword,
  GQLOperations.Mutation.Register,
];
