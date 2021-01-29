import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import { CreateFundingAccountInput } from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import {
  NumberField,
  SubmitError,
  TextField,
} from '../../../../components/form';
import { FundingAccountLookupItem } from '../../../../components/form/Lookup/FundingAccount';
import { max, min } from '../../../../components/form/validators';
import { CreateFundingAccountDocument } from './CreateFundingAccount.generated';

export type CreateFundingAccountProps = Except<
  DialogFormProps<CreateFundingAccountInput, FundingAccountLookupItem>,
  'onSubmit'
>;

export const CreateFundingAccount = (props: CreateFundingAccountProps) => {
  const [createFundingAccount] = useMutation(CreateFundingAccountDocument);
  return (
    <DialogForm
      {...props}
      onSubmit={async (input) => {
        const { data } = await createFundingAccount({
          variables: { input },
        });

        return data!.createFundingAccount.fundingAccount;
      }}
      title="Create Funding Account"
      fieldsPrefix="fundingAccount"
    >
      <SubmitError />
      <TextField
        name="name"
        label="Account Name"
        placeholder="Enter account name"
        required
      />
      <NumberField
        name="accountNumber"
        label="Account Number"
        placeholder="Enter account number"
        validate={[min(0), max(9)]}
        disableGrouping
        required
      />
    </DialogForm>
  );
};
