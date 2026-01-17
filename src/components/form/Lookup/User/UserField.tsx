import { CreatePerson } from '~/api/schema.graphql';
import { CreateUser } from '../../../../scenes/Users/Create';
import { LookupField } from '../../index';
import {
  UserLookupDocument,
  UserLookupItemFragment,
} from './UserLookup.graphql';

export const UserField = LookupField.createFor<
  UserLookupItemFragment,
  CreatePerson
>({
  resource: 'User',
  lookupDocument: UserLookupDocument,
  getOptionLabel: (option) => option.fullName,
  label: 'Person',
  placeholder: 'Search for a person by name',
  CreateDialogForm: CreateUser,
  getInitialValues: (val) => ({
    realFirstName: val,
    displayFirstName: val,
  }),
});
