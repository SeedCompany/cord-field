import React, { FC } from 'react';
import { UpdateLanguageInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';
import { NumberField } from '../../../components/form/NumberField';
import { YearField } from '../../../components/form/YearField';
import { LanguageQuery } from '../Overview/LanguageOverview.generated';

export type EditLanguageFormProps = DialogFormProps<UpdateLanguageInput> & {
  language?: LanguageQuery['language'];
};

export const EditLanguageForm: FC<EditLanguageFormProps> = ({
  language,
  ...props
}) => {
  return (
    <DialogForm
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...props}
      title="Edit Language"
    >
      <SubmitError />
      <TextField
        name="language.name"
        label="Name"
        placeholder="Enter language"
        autoFocus
        required
        disabled={!language?.name.canEdit}
      />
      <TextField
        name="language.displayName"
        label="Display Name"
        placeholder="Enter Display Name"
        required
        disabled={!language?.displayName.canEdit}
      />
      <YearField
        name="language.beginFiscalYear"
        label="Fiscal Year"
        placeholder="Enter Fiscal Year Begun"
        disabled={!language?.beginFiscalYear?.canEdit}
      />
      <TextField
        name="language.ethnologueName"
        label="Ethnologue Name"
        placeholder="Enter Ethnologue Name"
        disabled={!language?.ethnologueName?.canEdit}
      />
      <NumberField
        name="language.ethnologuePopulation"
        label="Ethnologue Population"
        placeholder="Enter Ethnologue Population"
        disabled={!language?.ethnologuePopulation?.canEdit}
      />
      <NumberField
        name="language.organizationPopulation"
        label="Organization Population"
        placeholder="Enter Organization Population"
        disabled={!language?.organizationPopulation?.canEdit}
      />
      <NumberField
        name="language.rodNumber"
        label="Rod Number"
        placeholder="Enter Rod Population"
        disabled={!language?.rodNumber?.canEdit}
      />
    </DialogForm>
  );
};
