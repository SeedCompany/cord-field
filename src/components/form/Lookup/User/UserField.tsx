import { LookupField } from '../../index';
import {
  UserLookupItemFragment,
  useUserLookupLazyQuery,
} from './UserLookup.generated';

export const UserField = LookupField.createFor<UserLookupItemFragment>({
  resource: 'User',
  useLookup: useUserLookupLazyQuery,
  getOptionLabel: (option) => option?.fullName ?? '',
});
