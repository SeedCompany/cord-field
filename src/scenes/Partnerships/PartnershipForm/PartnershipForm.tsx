import React from 'react';
import { useFormState } from 'react-final-form';
import {
  displayFinancialReportingType,
  displayPartnershipStatus,
  FinancialReportingTypeList,
  PartnershipAgreementStatusList,
  PartnershipType,
  PartnershipTypeList,
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
  SecuredField,
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
  console.log('partnership', partnership);
  const radioOptions = PartnershipAgreementStatusList.map((status) => (
    <RadioOption
      key={status}
      label={displayPartnershipStatus(status)}
      value={status}
    />
  ));

  const typesCheckboxes = PartnershipTypeList.map((type: PartnershipType) => (
    <div style={{ width: '50%' }} key={type}>
      <CheckboxOption key={type} label={type} value={type} />
    </div>
  ));

  return (
    <DialogForm<T> {...rest} fieldsPrefix="partnership">
      <SubmitError />
      {!partnership && <OrganizationField name="organizationId" required />}
      {partnership ? (
        <SecuredField obj={partnership} name="types">
          {(props) => (
            <CheckboxesField label="Types" row {...props}>
              {typesCheckboxes}
            </CheckboxesField>
          )}
        </SecuredField>
      ) : (
        <CheckboxesField label="Types" row name="types">
          {typesCheckboxes}
        </CheckboxesField>
      )}
      <FundingType<T> partnership={partnership} />
      {partnership && (
        <>
          <SecuredField obj={partnership} name="agreementStatus">
            {(props) => (
              <RadioField label="Agreement Status" {...props}>
                {radioOptions}
              </RadioField>
            )}
          </SecuredField>
          <SecuredField obj={partnership} name="mouStatus">
            {(props) => (
              <RadioField label="Mou Status" {...props}>
                {radioOptions}
              </RadioField>
            )}
          </SecuredField>
        </>
      )}
    </DialogForm>
  );
};

const FundingType = <
  InputType extends CreatePartnershipFormInput | EditPartnershipFormInput
>({
  partnership,
}: {
  partnership: PartnershipFormProps<InputType>['partnership'];
}) => {
  const { values } = useFormState<InputType>();
  const managingTypeSelected = hasManagingType(values.partnership.types);

  const radioOptions = FinancialReportingTypeList.map((type) => (
    <RadioOption
      key={type}
      value={type}
      label={displayFinancialReportingType(type)}
    />
  ));

  return managingTypeSelected ? (
    partnership ? (
      <SecuredField obj={partnership} name="financialReportingType">
        {(props) => (
          <RadioField label="Financial Reporting Type" fullWidth row {...props}>
            {radioOptions}
          </RadioField>
        )}
      </SecuredField>
    ) : (
      <RadioField
        name="financialReportingType"
        label="Financial Reporting Type"
        fullWidth
        row
      >
        {radioOptions}
      </RadioField>
    )
  ) : null;
};
