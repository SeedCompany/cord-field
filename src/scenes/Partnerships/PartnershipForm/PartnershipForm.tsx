import React from 'react';
import {
  displayFinancialReportingType,
  displayPartnershipStatus,
  FinancialReportingTypeList,
  PartnershipAgreementStatus,
  PartnershipAgreementStatusList,
  PartnershipType,
  PartnershipTypeList,
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
}: PartnershipFormProps<T>) => (
  <DialogForm<T> {...rest} fieldsPrefix="partnership">
    {({ values }) => (
      <>
        <SubmitError />
        {!partnership && <OrganizationField name="organizationId" required />}
        <SecuredField obj={partnership} name="types">
          {(props) => (
            <EnumField
              multiple
              label="Types"
              options={PartnershipTypeList}
              layout="two-column"
              {...props}
            />
          )}
        </SecuredField>
        {hasManagingType(values.partnership.types) ? (
          <SecuredField obj={partnership} name="financialReportingType">
            {(props) => (
              <EnumField
                label="Financial Reporting Type"
                options={FinancialReportingTypeList}
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
    )}
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
