import { useMutation } from '@apollo/client';
import { Many, many } from '@seedcompany/common';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import { ComponentType, useMemo } from 'react';
import { Except, Merge, Paths, Split } from 'type-fest';
import {
  CoerceNonPrimitives,
  FinancialReportingTypeLabels,
  FinancialReportingTypeList,
  OrganizationReachList,
  OrganizationTypeList,
  PartnerTypeList,
  UpdateOrganization,
  UpdatePartner,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  AlphaUppercaseField,
  CheckboxField,
  DateField,
  EnumField,
  SecuredField,
  SubmitError,
  TextField,
} from '../../../components/form';
import { UserField, UserLookupItem } from '../../../components/form/Lookup';
import { PartnerDetailsFragment } from '../Detail/PartnerDetail.graphql';
import { UpdatePartnerDocument } from './UpdatePartner.graphql';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type PartnerFormValues = {
  partner: Merge<
    UpdatePartner,
    {
      pointOfContactId: UserLookupItem | null;
    }
  >;
  organization: UpdateOrganization;
};

export type EditablePartnerField = keyof typeof fieldMapping;

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

type PossibleFields = Partial<
  Record<
    Paths<CoerceNonPrimitives<PartnerFormValues>>,
    ComponentType<PartnerFieldProps>
  >
>;

const fieldMapping = {
  'partner.pointOfContactId': ({ props }) => (
    <UserField {...props} label="Point of Contact" />
  ),
  'partner.globalInnovationsClient': ({ props }) => (
    <CheckboxField {...props} label="Growth Partners' Client" />
  ),
  'partner.active': ({ props }) => <CheckboxField {...props} label="Active" />,
  'partner.pmcEntityCode': ({ props }) => (
    <AlphaUppercaseField chars={3} {...props} label="PMC Entity Code" />
  ),
  'partner.types': ({ props }) => (
    <EnumField
      multiple
      label="Types"
      options={PartnerTypeList}
      layout="two-column"
      {...props}
    />
  ),
  'partner.financialReportingTypes': ({ props, values }) =>
    values.partner.types?.includes('Managing') ? (
      <EnumField
        label="Financial Reporting Types"
        options={FinancialReportingTypeList}
        multiple
        {...props}
        getLabel={labelFrom(FinancialReportingTypeLabels)}
      />
    ) : null,
  'partner.address': ({ props }) => (
    <TextField {...props} label="Address" multiline minRows={2} />
  ),
  'partner.startDate': ({ props }) => (
    <DateField {...props} label="Start Date" />
  ),
  'organization.name': ({ props }) => (
    <TextField {...props} required label="Name" />
  ),
  'organization.acronym': ({ props }) => (
    <TextField {...props} label="Acronym" />
  ),
  'organization.reach': ({ props }) => (
    <EnumField
      multiple
      label="Reach"
      options={OrganizationReachList}
      layout="two-column"
      {...props}
    />
  ),
  'organization.types': ({ props }) => (
    <EnumField
      multiple
      label="Types"
      options={OrganizationTypeList}
      layout="two-column"
      {...props}
    />
  ),
} satisfies PossibleFields;

const decorators: Array<Decorator<PartnerFormValues>> = [
  ...DialogForm.defaultDecorators,
  onFieldChange(
    // if a user unselects the managing type, then wipe the financial reporting type values
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
  editFields,
  ...props
}: EditPartnerProps) => {
  const [updatePartner] = useMutation(UpdatePartnerDocument);

  const initialValues = useMemo(() => {
    const organization = partner.organization.value!;
    return {
      partner: {
        id: partner.id,
        globalInnovationsClient: partner.globalInnovationsClient.value,
        pmcEntityCode: partner.pmcEntityCode.value,
        active: partner.active.value,
        types: partner.types.value,
        financialReportingTypes: partner.financialReportingTypes.value,
        address: partner.address.value,
        startDate: partner.startDate.value,
        pointOfContactId: partner.pointOfContact.value ?? null,
      },
      organization: {
        id: organization.id,
        name: organization.name.value,
        acronym: organization.acronym.value,
        types: organization.types.value,
        reach: organization.reach.value,
      },
    } satisfies PartnerFormValues;
  }, [partner]);

  return (
    <DialogForm<PartnerFormValues>
      title="Edit Partner"
      {...props}
      decorators={decorators}
      initialValues={initialValues}
      onSubmit={async ({ partner, organization }) => {
        await updatePartner({
          variables: {
            partner: {
              ...partner,
              pointOfContactId: partner.pointOfContactId?.id ?? null,
            },
            organization,
          },
        });
      }}
    >
      {({ values }) => (
        <>
          <SubmitError />
          {many(editFields ?? []).map((name) => {
            const Field = fieldMapping[name];

            const [prefix, suffix] = name.split('.') as Split<typeof name, '.'>;
            let obj: typeof partner | (typeof partner.organization.value & {}) =
              partner;
            if (prefix === 'organization') {
              if (
                !partner.organization.canRead ||
                !partner.organization.value
              ) {
                return null;
              }
              obj = partner.organization.value;
            }
            return (
              <SecuredField obj={obj} name={suffix} key={name}>
                {(props) => (
                  <Field
                    props={{ ...props, name }}
                    partner={partner}
                    values={values}
                  />
                )}
              </SecuredField>
            );
          })}
        </>
      )}
    </DialogForm>
  );
};
