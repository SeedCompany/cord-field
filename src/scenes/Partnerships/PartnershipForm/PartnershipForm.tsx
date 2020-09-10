import React from 'react';
import { useFormState } from 'react-final-form';
import {
  displayPartnershipFundingType,
  displayPartnershipStatus,
  PartnershipFundingTypeList,
  PartnershipStatuses,
  PartnershipType,
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
import { OrganizationField } from '../../../components/form/Lookup';
import { Nullable } from '../../../util';
import { CreatePartnershipFormInput } from '../Create';
import { EditPartnershipFormInput } from '../Edit';
import { PartnershipFormFragment } from './PartnershipForm.generated';

export type PartnershipFormProps<T> = DialogFormProps<T> & {
  partnership?: PartnershipFormFragment;
};

export const hasManagingType = (types: Nullable<readonly PartnershipType[]>) =>
  types?.includes('Managing') ?? false;

export const PartnershipForm = <
  T extends CreatePartnershipFormInput | EditPartnershipFormInput
>({
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
    <DialogForm<T> {...rest} fieldsPrefix="partnership">
      <SubmitError />
      {!partnership && (
        <OrganizationField
          name="partnership.organizationId"
          required
        />
      )}
      <CheckboxesField
        name="partnership.types"
        label="Types"
        row
        disabled={partnership ? !partnership.types.canEdit : false}
      >
        {([
          'Managing',
          'Funding',
          'Impact',
          'Technical',
          'Resource',
        ] as PartnershipType[]).map((type: PartnershipType) => (
          <div style={{ width: '50%' }} key={type}>
            <CheckboxOption key={type} label={type} value={type} />
          </div>
        ))}
      </CheckboxesField>
      <FundingType<T> />
      {partnership && (
        <>
          <RadioField
            name="partnership.agreementStatus"
            label="Agreement Status"
            disabled={!partnership.agreementStatus.canEdit}
          >
            {radioOptions}
          </RadioField>
          <RadioField
            name="partnership.mouStatus"
            label="Mou Status"
            disabled={!partnership.mouStatus.canEdit}
          >
            {radioOptions}
          </RadioField>
        </>
      )}
    </DialogForm>
  );
};

const FundingType = <
  InputType extends CreatePartnershipFormInput | EditPartnershipFormInput
>() => {
  const { values } = useFormState<InputType>();
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
