import { CreatePersonInput } from '~/api/schema.graphql';
import { CreateUser } from '../../../../scenes/Users/Create';
import { LookupField } from '../../index';
import {
  UserLookupDocument,
  UserLookupItemFragment,
} from './UserLookup.graphql';

export const UserField = LookupField.createFor<
  UserLookupItemFragment,
  CreatePersonInput
>({
  resource: 'User',
  lookupDocument: UserLookupDocument,
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
