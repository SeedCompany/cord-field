import { useMutation } from '@apollo/client';
import { Many, many } from '@seedcompany/common';
import { Decorator } from 'final-form';
import onFieldChange from 'final-form-calculate';
import { ComponentType, useMemo } from 'react';
import { Except, Merge, Paths } from 'type-fest';
import {
  CoerceNonPrimitives,
  FinancialReportingTypeLabels,
  FinancialReportingTypeList,
  PartnerTypeList,
  UpdateOrganization,
  UpdatePartner,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { CheckboxesGroup, FieldData } from '~/components/form/CheckboxesGroup';
import { RadioButtonsGroup } from '~/components/form/RadioButtonsGroup';
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
      pointOfContactId?: UserLookupItem | null;
    }
  >;
  organization: UpdateOrganization;
};

export type EditablePartnerField = keyof typeof fieldMapping;

export interface LanguagesData {
  languagesOfConsulting: FieldData[];
  languagesOfWiderCommunication: FieldData[];
  languagesOfReporting: FieldData[];
}

type EditPartnerProps = Except<
  DialogFormProps<PartnerFormValues>,
  'onSubmit' | 'initialValues'
> & {
  partner: PartnerDetailsFragment;
  editFields?: Many<EditablePartnerField>;
  languagesData?: LanguagesData;
};

interface PartnerFieldProps {
  props: {
    name: string;
  };
  partner: PartnerDetailsFragment;
  values: PartnerFormValues;
  languagesData?: LanguagesData;
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
    <CheckboxField {...props} label="Global Innovations Client" />
  ),
  'partner.active': ({ props }) => <CheckboxField {...props} label="Active" />,
  'partner.pmcEntityCode': ({ props }) => (
    <AlphaUppercaseField chars={3} {...props} label="PMC Entity Code" />
  ),
  'partner.languagesOfConsulting': ({ languagesData }) => {
    return languagesData ? (
      <CheckboxesGroup
        fieldsData={languagesData.languagesOfConsulting}
        labelPlacement="end"
        prefix="languageOfConsulting"
        title="Languages of Consulting"
        marginBottom={2}
        fieldName="partner.languagesOfConsulting"
      />
    ) : null;
  },
  'partner.languageOfWiderCommunicationId': ({ languagesData }) => {
    return languagesData ? (
      <RadioButtonsGroup
        title="Language of Wider Communication"
        fieldsData={languagesData.languagesOfWiderCommunication}
        labelPlacement="end"
        name="partner.languageOfWiderCommunicationId"
        marginBottom={2}
      />
    ) : null;
  },
  'partner.languageOfReportingId': ({ languagesData }) => {
    return languagesData ? (
      <RadioButtonsGroup
        title="Language of Reporting"
        fieldsData={languagesData.languagesOfReporting}
        labelPlacement="end"
        name="partner.languageOfReportingId"
      />
    ) : null;
  },
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
  languagesData,
  ...props
}: EditPartnerProps) => {
  const [updatePartner] = useMutation(UpdatePartnerDocument);

  const initialValues = useMemo(() => {
    const organization = partner.organization.value!;
    const languagesOfConsulting: string[] =
      partner.languagesOfConsulting.value.map((language) => language.id);
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
        languagesOfConsulting,
        languageOfWiderCommunicationId:
          partner.languageOfWiderCommunication.value?.id,
        languageOfReportingId: partner.languageOfReporting.value?.id,
      },
      organization: {
        id: organization.id,
        name: organization.name.value,
        acronym: organization.acronym.value,
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

            const [prefix, suffix] = name.split('.');
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
              <SecuredField obj={obj} name={suffix!} key={name}>
                {(props) => (
                  <Field
                    props={{ ...props, name }}
                    partner={partner}
                    values={values}
                    languagesData={languagesData}
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
