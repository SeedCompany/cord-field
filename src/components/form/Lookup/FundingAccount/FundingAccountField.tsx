import { LookupField } from '../..';
import { CreateFundingAccountInput } from '../../../../api';
import { CreateFundingAccount } from '../../../../scenes/Locations/LocationForm/FundingAccount/CreateFundingAccount';
import {
  FundingAccountLookupItemFragment as FundingAccount,
  FundingAccountLookupDocument,
} from './FundingAccountField.generated';

export const FundingAccountField = LookupField.createFor<
  FundingAccount,
  CreateFundingAccountInput
>({
  resource: 'FundingAccount',
  lookupDocument: FundingAccountLookupDocument,
  label: 'Funding Account',
  placeholder: 'Search for a funding account by name',
  CreateDialogForm: CreateFundingAccount,
  // @ts-expect-error don't need to pass through entire initialValues
  getInitialValues: (val) => ({
    fundingAccount: {
      name: val,
    },
  }),
});
