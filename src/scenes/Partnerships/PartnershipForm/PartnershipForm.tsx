import React from 'react';
import {
  displayFinancialReportingType,
  displayPartnershipStatus,
  PartnershipAgreementStatus,
  PartnershipAgreementStatusList,
  PartnerType,
} from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  EnumField,
  EnumFieldProps,
  SecuredField,
  SubmitError,
} from '../../../components/form';
import {
  PartnerField,
  PartnerLookupItem,
} from '../../../components/form/Lookup';
import { Nullable } from '../../../util';
import { CreatePartnershipFormInput } from '../Create';
import { EditPartnershipFormInput } from '../Edit';
import { PartnershipFormFragment } from './PartnershipForm.generated';

type PartnershipformValues = Partial<
  CreatePartnershipFormInput | EditPartnershipFormInput
> & {
  partnership?: {
    partnerLookupItem?: PartnerLookupItem;
  };
};

export type PartnershipFormProps<
  T extends PartnershipformValues
> = DialogFormProps<T> & {
  partnership?: PartnershipFormFragment;
};

export const hasManagingType = (types: Nullable<readonly PartnerType[]>) =>
  types?.includes('Managing') ?? false;

export const PartnershipForm = <T extends PartnershipformValues>({
  partnership,
  ...rest
}: PartnershipFormProps<T>) => (
  <DialogForm<T> {...rest} fieldsPrefix="partnership">
    {({ values }) => {
      const lookupPartnerTypes =
        values.partnership?.partnerLookupItem?.types.value;
      const lookupPartnerFinType =
        values.partnership?.partnerLookupItem?.financialReportingTypes.value;
      const currentPartnerTypes = partnership?.partner.value?.types.value;
      const currentPartnerFinTypes =
        partnership?.partner.value?.financialReportingTypes.value;

      return (
        <>
          <SubmitError />
          {!partnership && <PartnerField name="partnerLookupItem" required />}
          {lookupPartnerTypes?.length || currentPartnerTypes?.length ? (
            <SecuredField obj={partnership} name="types">
              {(props) => (
                <EnumField
                  multiple
                  label="Types"
                  options={lookupPartnerTypes || currentPartnerTypes || []}
                  layout="two-column"
                  {...props}
                />
              )}
            </SecuredField>
          ) : null}
          {hasManagingType(values.partnership?.types) ? (
            <SecuredField obj={partnership} name="financialReportingType">
              {(props) => (
                <EnumField
                  label="Financial Reporting Type"
                  options={lookupPartnerFinType || currentPartnerFinTypes || []}
                  getLabel={displayFinancialReportingType}
                  {...props}
                />
              )}
            </SecuredField>
          ) : null}
          {partnership && (
            <>
              <SecuredField obj={partnership} name="agreementStatus">
                {(props) => (
                  <AgreementStatusField label="Agreement Status" {...props} />
                )}
              </SecuredField>
              <SecuredField obj={partnership} name="mouStatus">
                {(props) => (
                  <AgreementStatusField label="Mou Status" {...props} />
                )}
              </SecuredField>
            </>
          )}
        </>
      );
    }}
  </DialogForm>
);

const AgreementStatusField = (
  props: Omit<EnumFieldProps<PartnershipAgreementStatus, false>, 'children'>
) => (
  <EnumField
    {...props}
    options={PartnershipAgreementStatusList}
    getLabel={displayPartnershipStatus}
  />
);
