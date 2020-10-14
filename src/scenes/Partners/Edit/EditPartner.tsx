import React, { ComponentType, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import {
  displayFinancialReportingType,
  FinancialReportingTypeList,
  GQLOperations,
  PartnerTypeList,
  UpdatePartner,
} from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxField,
  EnumField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { UserField, UserLookupItem } from '../../../components/form/Lookup';
import { isLength } from '../../../components/form/validators';
import { ExtractStrict, many, Many } from '../../../util';
import { PartnerDetailsFragment } from '../Detail/PartnerDetail.generated';
import { useUpdatePartnerMutation } from './EditPartner.generated';

interface PartnerFormValues {
  partner: Merge<
    UpdatePartner,
    {
      pointOfContactId?: UserLookupItem;
    }
  >;
}

export type EditablePartnerField = ExtractStrict<
  keyof UpdatePartner,
  // Add more fields here as needed
  | 'pointOfContactId'
  | 'globalInnovationsClient'
  | 'pmcEntityCode'
  | 'active'
  | 'types'
  | 'financialReportingTypes'
  | 'address'
>;

type EditPartnerProps = Except<
  DialogFormProps<PartnerFormValues>,
  'onSubmit' | 'initialValues'
> & {
  partner: PartnerDetailsFragment;
  editFields?: Many<EditablePartnerField>;
};
interface EngagementFieldProps {
  props: {
    name: string;
  };
  hide?: boolean;
}

const fieldMapping: Record<
  EditablePartnerField,
  ComponentType<EngagementFieldProps>
> = {
  pointOfContactId: ({ props }) => (
    <UserField {...props} label="Point of Contact" />
  ),
  globalInnovationsClient: ({ props }) => (
    <CheckboxField {...props} label="Global Innovations Client" />
  ),
  active: ({ props }) => <CheckboxField {...props} label="Active" />,
  pmcEntityCode: ({ props }) => (
    <TextField {...props} label="PMC Entity Code" validate={isLength(3)} />
  ),
  types: ({ props }) => (
    <EnumField
      multiple
      label="Types"
      options={PartnerTypeList}
      layout="two-column"
      {...props}
    />
  ),
  //TODO: fix hard crash and missing initialValues
  financialReportingTypes: ({ props, hide }) =>
    hide ? null : (
      <EnumField
        label="Financial Reporting Type"
        options={FinancialReportingTypeList}
        {...props}
        getLabel={displayFinancialReportingType}
      />
    ),
  address: ({ props }) => <TextField {...props} label="Address" />,
};

export const EditPartner = ({
  partner,
  editFields: editFieldsProp,
  ...props
}: EditPartnerProps) => {
  const [updatePartner] = useUpdatePartnerMutation({
    refetchQueries: [GQLOperations.Query.Partner],
  });

  const initialValues = useMemo(
    () => ({
      partner: {
        id: partner.id,
        globalInnovationsClient: partner.globalInnovationsClient.value,
        pmcEntityCode: partner.pmcEntityCode.value,
        active: partner.active.value,
        types: partner.types.value,
        financialReportingTypes: partner.financialReportingTypes.value,
        address: partner.address.value,
      },
    }),
    [partner]
  );

  const editFields = useMemo(() => many(editFieldsProp ?? []), [
    editFieldsProp,
  ]);

  return (
    <DialogForm<PartnerFormValues>
      title="Edit Partner"
      {...props}
      initialValues={initialValues}
      onSubmit={async ({
        partner: { pointOfContactId, pmcEntityCode, ...rest },
      }) => {
        await updatePartner({
          variables: {
            input: {
              partner: {
                ...rest,
                pointOfContactId: pointOfContactId?.id,
                pmcEntityCode: pmcEntityCode?.toUpperCase(),
              },
            },
          },
        });
      }}
      fieldsPrefix="partner"
    >
      {({ values }) => (
        <>
          <SubmitError />
          {editFields.map((name) => {
            const Field = fieldMapping[name];
            return (
              <Field
                props={{ name }}
                key={name}
                hide={!values.partner.types?.includes('Managing')}
              />
            );
          })}
        </>
      )}
    </DialogForm>
  );
};
