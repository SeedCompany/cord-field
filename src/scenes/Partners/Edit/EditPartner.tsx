import { useMutation } from '@apollo/client';
import { Many, many } from '@seedcompany/common';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import { ComponentType, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import {
  FinancialReportingTypeLabels,
  FinancialReportingTypeList,
  PartnerTypeList,
  UpdatePartner,
} from '~/api/schema.graphql';
import { ExtractStrict, labelFrom } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxField,
  DateField,
  EnumField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { UserField, UserLookupItem } from '../../../components/form/Lookup';
import { isLength } from '../../../components/form/validators';
import { PartnerDetailsFragment } from '../Detail/PartnerDetail.graphql';
import { UpdateOrganizationNameDocument } from './EditOrganizationName.graphql';
import { UpdatePartnerDocument } from './EditPartner.graphql';

interface PartnerFormValues {
  partner: Merge<
    UpdatePartner,
    {
      pointOfContactId?: UserLookupItem;
      organizationName: string;
    }
  >;
}

export type EditablePartnerField = ExtractStrict<
  keyof UpdatePartner | 'organizationName' | 'contactInfo',
  // Add more fields here as needed
  | 'pointOfContactId'
  | 'globalInnovationsClient'
  | 'pmcEntityCode'
  | 'active'
  | 'types'
  | 'financialReportingTypes'
  | 'contactInfo'
  | 'organizationName'
  | 'startDate'
>;

type EditPartnerProps = Except<
  DialogFormProps<PartnerFormValues>,
  'onSubmit' | 'initialValues'
> & {
  partner: PartnerDetailsFragment;
  editFields?: Many<EditablePartnerField>;
};

interface PartnerFieldProps {
  props: {
    name: string;
  };
  partner: PartnerDetailsFragment;
  values: PartnerFormValues;
}

const fieldMapping: Record<
  EditablePartnerField,
  ComponentType<PartnerFieldProps>
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
  financialReportingTypes: ({ props, values }) =>
    values.partner.types?.includes('Managing') ? (
      <EnumField
        label="Financial Reporting Types"
        options={FinancialReportingTypeList}
        multiple
        {...props}
        getLabel={labelFrom(FinancialReportingTypeLabels)}
      />
    ) : null,
  contactInfo: ({ props }) => (
    <>
      <TextField
        {...props}
        name="address"
        label="Address"
        multiline
        minRows={2}
      />
      <TextField {...props} name="websiteUrl" label="Website Url" />
      <TextField {...props} name="socialUrl" label="Social Url" />
    </>
  ),
  organizationName: ({ props }) => (
    <TextField {...props} required label="Organization Name" />
  ),
  startDate: ({ props }) => <DateField {...props} label="Start Date" />,
};

const decorators: Array<Decorator<PartnerFormValues>> = [
  ...DialogForm.defaultDecorators,
  onFieldChange(
    // if user unselects managing type, wipe the financial reporting type values
    {
      field: 'partner.types',
      updates: {
        'partner.financialReportingTypes': (types, currentValues) =>
          types?.includes('Managing')
            ? currentValues.partner.financialReportingTypes
            : undefined,
      },
    }
  ),
];

export const EditPartner = ({
  partner,
  editFields: editFieldsProp,
  ...props
}: EditPartnerProps) => {
  const [updatePartner] = useMutation(UpdatePartnerDocument);
  const [updateOrganizationName] = useMutation(UpdateOrganizationNameDocument);

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
        websiteUrl: partner.websiteUrl.value,
        socialUrl: partner.socialUrl.value,
        organizationName: partner.organization.value!.name.value!,
        startDate: partner.startDate.value,
      },
    }),
    [partner]
  );

  const editFields = useMemo(
    () => many(editFieldsProp ?? []),
    [editFieldsProp]
  );

  return (
    <DialogForm<PartnerFormValues>
      title="Edit Partner"
      {...props}
      decorators={decorators}
      initialValues={initialValues}
      onSubmit={async (
        {
          partner: {
            pointOfContactId,
            pmcEntityCode,
            organizationName,
            address,
            ...rest
          },
        },
        form
      ) => {
        const { 'partner.organizationName': nameDirty, ...dirty } =
          form.getState().dirtyFields;
        await Promise.all([
          nameDirty &&
            updateOrganizationName({
              variables: {
                id: partner.organization.value!.id,
                name: organizationName,
              },
            }),
          Object.keys(dirty).length > 0 &&
            updatePartner({
              variables: {
                input: {
                  partner: {
                    ...rest,
                    address: address ?? null,
                    pointOfContactId: pointOfContactId?.id,
                    pmcEntityCode: pmcEntityCode?.toUpperCase(),
                  },
                },
              },
            }),
        ]);
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
                partner={partner}
                values={values}
              />
            );
          })}
        </>
      )}
    </DialogForm>
  );
};
