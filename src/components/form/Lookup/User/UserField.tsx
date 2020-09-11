import { CreatePersonInput } from '../../../../api';
import { CreateUser } from '../../../../scenes/Users/Create';
import { LookupField } from '../../index';
import {
  UserLookupItemFragment,
  useUserLookupLazyQuery,
} from './UserLookup.generated';

export const UserField = LookupField.createFor<
  UserLookupItemFragment,
  CreatePersonInput
>({
  resource: 'User',
  useLookup: useUserLookupLazyQuery,
  getOptionLabel: (option) => option.fullName,
  label: 'Person',
  placeholder: 'Search for a person by name',
  CreateDialogForm: CreateUser,
  getInitialValues: (val): Partial<CreatePersonInput> => ({
    // @ts-expect-error the partial type doesn't match and the generic is not
    // being passed around everywhere yet.
    person: {
      realFirstName: val,
      displayFirstName: val,
    },
  }),
});
