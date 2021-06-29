import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import React from 'react';
import {
  displayFinancialReportingType,
  displayPartnershipStatus,
  PartnershipAgreementStatus,
  PartnershipAgreementStatusList,
  PartnerType,
  PeriodType,
  PeriodTypeList,
} from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  DateField,
  EnumField,
  EnumFieldProps,
  SecuredField,
  SubmitError,
  SwitchField,
} from '../../../components/form';
import {
  PartnerField,
  PartnerLookupItem,
} from '../../../components/form/Lookup';
import { Nullable } from '../../../util';
import { CreatePartnershipFormInput } from '../Create';
import { EditPartnershipFormInput } from '../Edit';
import { PartnershipFormFragment } from './PartnershipForm.generated';

type PartnershipFormValues = Partial<
  CreatePartnershipFormInput | EditPartnershipFormInput
> & {
  partnership?: {
    partnerLookupItem?: PartnerLookupItem;
  };
};

export type PartnershipFormProps<T extends PartnershipFormValues> =
  DialogFormProps<T> & {
    partnership?: PartnershipFormFragment & {
      financialReportPeriod?: PeriodType;
    };
  };

export const hasManagingType = (types: Nullable<readonly PartnerType[]>) =>
  types?.includes('Managing') ?? false;

const decorators: Array<Decorator<PartnershipFormValues>> = [
  ...DialogForm.defaultDecorators,
  onFieldChange(
    // if user selects a different partner (on create partnership), wipe the types and fin type values
    {
      field: 'partnership.partnerLookupItem',
      isEqual: PartnerField.isEqual,
      updates: {
        'partnership.types': () => undefined,
        'partnership.financialReportingType': () => undefined,
      },
    },
    // if user unselects managing type (on create or update), wipe the financial reporting type values
    {
      field: 'partnership.types',
      updates: {
        'partnership.financialReportingType': (partnerTypes, currentValues) =>
          partnerTypes?.includes('Managing')
            ? currentValues.partnership?.financialReportingType
            : undefined,
      },
    }
  ),
];

export const PartnershipForm = <T extends PartnershipFormValues>({
  partnership,
  ...rest
}: PartnershipFormProps<T>) => {
  return (
    <DialogForm<T>
      {...rest}
      fieldsPrefix="partnership"
      decorators={decorators as unknown as Array<Decorator<T>>}
    >
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
              <>
                <SecuredField obj={partnership} name="financialReportingType">
                  {(props) => (
                    <EnumField
                      label="Financial Reporting Type"
                      options={
                        lookupPartnerFinType || currentPartnerFinTypes || []
                      }
                      getLabel={displayFinancialReportingType}
                      {...props}
                    />
                  )}
                </SecuredField>

                {partnership?.primary && (
                  <EnumField
                    label="Financial Reporting Frequency"
                    options={PeriodTypeList}
                    name="financialReportPeriod"
                  />
                )}
              </>
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

                <SecuredField obj={partnership} name="mouRange">
                  {(props) => (
                    <>
                      <DateField
                        {...props}
                        name="mouStartOverride"
                        label="Start Date"
                        helperText="Leave blank to use the project's mou start date"
                      />
                      <DateField
                        {...props}
                        name="mouEndOverride"
                        label="End Date"
                        helperText="Leave blank to use the project's mou end date"
                      />
                    </>
                  )}
                </SecuredField>
              </>
            )}
            {!partnership || partnership.primary.value === false ? (
              <SecuredField obj={partnership} name="primary">
                {(props) => <SwitchField label="Set primary" {...props} />}
              </SecuredField>
            ) : null}
          </>
        );
      }}
    </DialogForm>
  );
};

const AgreementStatusField = (
  props: Omit<EnumFieldProps<PartnershipAgreementStatus, false>, 'children'>
) => (
  <EnumField
    {...props}
    options={PartnershipAgreementStatusList}
    getLabel={displayPartnershipStatus}
  />
);
