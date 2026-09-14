import { CreateFundingAccount as CreateFundingAccountInput } from '~/api/schema.graphql.ts';
import { LookupField } from '../..';
import { CreateFundingAccount } from '../../../../scenes/Locations/LocationForm/FundingAccount/CreateFundingAccount';
import {
  FundingAccountLookupItemFragment as FundingAccount,
  FundingAccountLookupDocument,
} from './FundingAccountField.graphql.ts';
import {
  InitialFundingAccountOptionsQuery,
  InitialFundingAccountOptionsDocument as InitialFundingAccounts,
} from './InitialFundingAccountOptions.graphql.ts';

export const FundingAccountField = LookupField.createFor<
  FundingAccount,
  CreateFundingAccountInput,
  InitialFundingAccountOptionsQuery
>({
  resource: 'FundingAccount',
  initial: [
    InitialFundingAccounts,
    ({ fundingAccounts }) => fundingAccounts.items,
  ],
  lookupDocument: FundingAccountLookupDocument,
  label: 'Funding Account',
  placeholder: 'Search for a funding account by name',
  CreateDialogForm: CreateFundingAccount,
  getInitialValues: (name) => ({ name }),
});
