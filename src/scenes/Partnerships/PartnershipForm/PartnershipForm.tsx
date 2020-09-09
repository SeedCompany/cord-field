import { Box } from '@material-ui/core';
import React from 'react';
import { useFormState } from 'react-final-form';
import {
  displayPartnershipFundingType,
  displayPartnershipStatus,
  PartnershipFundingTypeList,
  PartnershipStatuses,
  PartnershipType,
  UpdatePartnershipInput,
} from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxesField,
  CheckboxOption,
  RadioField,
  RadioOption,
  SubmitError,
} from '../../../components/form';
import { Nullable } from '../../../util';
import { PartnershipFormFragment } from './PartnershipForm.generated';

export type PartnershipFormProps<T> = DialogFormProps<T> & {
  partnership?: PartnershipFormFragment;
};

export const hasManagingType = (types: Nullable<readonly PartnershipType[]>) =>
  types?.includes('Managing') ?? false;

export const PartnershipForm = <T extends any>({
  partnership,
  ...rest
}: PartnershipFormProps<T>) => {
  const radioOptions = PartnershipStatuses.map((status) => (
    <RadioOption
      key={status}
      label={displayPartnershipStatus(status)}
      value={status}
    />
  ));

  return (
    <DialogForm<T> {...rest}>
      <SubmitError />
      <CheckboxesField
        name="partnership.types"
        label="Types"
        row
        disabled={!partnership?.types.canEdit}
      >
        {([
          'Managing',
          'Funding',
          'Impact',
          'Technical',
          'Resource',
        ] as PartnershipType[]).map((type: PartnershipType) => (
          <Box width="50%" key={type}>
            <CheckboxOption key={type} label={type} value={type} />
          </Box>
        ))}
      </CheckboxesField>
      <FundingType />
      <RadioField
        name="partnership.agreementStatus"
        label="Agreement Status"
        disabled={!partnership?.agreementStatus.canEdit}
      >
        {radioOptions}
      </RadioField>
      <RadioField
        name="partnership.mouStatus"
        label="Mou Status"
        disabled={!partnership?.mouStatus.canEdit}
      >
        {radioOptions}
      </RadioField>
    </DialogForm>
  );
};

const FundingType = () => {
  const { values } = useFormState<UpdatePartnershipInput>();
  const managingTypeSelected = hasManagingType(values.partnership.types);

  return managingTypeSelected ? (
    <RadioField
      name="partnership.fundingType"
      label="Funding Type"
      fullWidth
      row
    >
      {PartnershipFundingTypeList.map((type) => (
        <RadioOption
          key={type}
          value={type}
          label={displayPartnershipFundingType(type)}
        />
      ))}
    </RadioField>
  ) : null;
};
