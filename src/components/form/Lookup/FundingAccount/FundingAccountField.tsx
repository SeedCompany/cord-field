import { LookupField } from '../..';
import { CreateFundingAccountInput } from '../../../../api';
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
});
