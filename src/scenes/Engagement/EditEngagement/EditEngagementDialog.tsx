import { useMutation } from '@apollo/client';
import { compact, keyBy, pick, startCase } from 'lodash';
import React, { ComponentType, FC, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import {
  displayInternDomain,
  displayInternPosition,
  displayInternProgram,
  MethodologyToApproach,
  UpdateInternshipEngagement,
  UpdateLanguageEngagement,
} from '../../../api';
import { DisplayLocationFragment } from '../../../api/fragments/location.generated';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxField,
  DateField,
  EnumField,
  FieldGroup,
  SubmitError,
  TextField,
} from '../../../components/form';
import { AutocompleteField } from '../../../components/form/AutocompleteField';
import { LocationField, UserField } from '../../../components/form/Lookup';
import { UserLookupItemFragment } from '../../../components/form/Lookup/User/UserLookup.generated';
import { ExtractStrict, many, Many } from '../../../util';
import { InternshipEngagementDetailFragment as InternshipEngagement } from '../InternshipEngagement/InternshipEngagement.generated';
import { LanguageEngagementDetailFragment as LanguageEngagement } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import {
  UpdateInternshipEngagementDocument,
  UpdateLanguageEngagementDocument,
} from './EditEngagementDialog.generated';

export type Engagement = InternshipEngagement | LanguageEngagement;

export type EditableEngagementField = ExtractStrict<
  keyof UpdateInternshipEngagement | keyof UpdateLanguageEngagement,
  // Add more fields here as needed
  | 'startDateOverride'
  | 'endDateOverride'
  | 'completeDate'
  | 'disbursementCompleteDate'
  | 'communicationsCompleteDate'
  | 'methodologies'
  | 'position'
  | 'countryOfOriginId'
  | 'mentorId'
  | 'firstScripture'
  | 'lukePartnership'
  | 'paratextRegistryId'
>;

interface EngagementFieldProps {
  props: {
    name: string;
  };
  engagement: Engagement;
}

const fieldMapping: Record<
  EditableEngagementField,
  ComponentType<EngagementFieldProps>
> = {
  startDateOverride: ({ props }) => (
    <DateField
      {...props}
      label="Start Date"
      helperText="Leave blank to use project's start date"
    />
  ),
  endDateOverride: ({ props }) => (
    <DateField
      {...props}
      label="End Date"
      helperText="Leave blank to use project's end date"
    />
  ),
  completeDate: ({ props, engagement }) => (
    <DateField
      {...props}
      label={
        engagement.__typename === 'InternshipEngagement'
          ? 'Growth Plan Complete Date'
          : 'Translation Complete Date'
      }
    />
  ),
  disbursementCompleteDate: ({ props }) => (
    <DateField {...props} label="Disbursement Complete Date" />
  ),
  communicationsCompleteDate: ({ props }) => (
    <DateField {...props} label="Communications Complete Date" />
  ),
  methodologies: ({ props }) => (
    <EnumField
      {...props}
      label="Methodologies"
      multiple
      options={Object.keys(MethodologyToApproach)}
      getLabel={startCase}
    />
  ),
  position: ({ props, engagement }) => {
    const options =
      engagement.__typename === 'InternshipEngagement'
        ? engagement.position.options
        : [];
    const groups = keyBy(options, (o) => o.position);
    return (
      <AutocompleteField
        {...props}
        label="Intern Position"
        options={options.map((o) => o.position)}
        groupBy={(p) => {
          const option = groups[p];
          return compact([
            displayInternProgram(option?.program),
            displayInternDomain(option?.domain),
          ]).join(' - ');
        }}
        getOptionLabel={displayInternPosition}
      />
    );
  },
  countryOfOriginId: ({ props }) => (
    <LocationField {...props} label="Country of Origin" />
  ),
  mentorId: ({ props }) => <UserField {...props} label="Mentor" />,
  firstScripture: ({ props }) => (
    <CheckboxField {...props} label="First Scripture" />
  ),
  lukePartnership: ({ props }) => (
    <CheckboxField {...props} label="Luke Partnership" />
  ),
  paratextRegistryId: ({ props }) => (
    <TextField {...props} label="Paratext Registry ID" />
  ),
};

interface EngagementFormValues {
  engagement: Merge<
    UpdateLanguageEngagement & UpdateInternshipEngagement,
    {
      mentorId?: UserLookupItemFragment | null;
      countryOfOriginId?: DisplayLocationFragment | null;
    }
  >;
}

export type EditEngagementDialogProps = Except<
  DialogFormProps<EngagementFormValues>,
  'onSubmit' | 'initialValues'
> & {
  engagement: Engagement;
  editFields?: Many<EditableEngagementField>;
};

export const EditEngagementDialog: FC<EditEngagementDialogProps> = ({
  engagement,
  editFields: editFieldsProp,
  ...props
}) => {
  const editFields = useMemo(() => many(editFieldsProp ?? []), [
    editFieldsProp,
  ]);

  const fields = editFields.map((name) => {
    const Field = fieldMapping[name];
    return <Field props={{ name }} engagement={engagement} key={name} />;
  });

  const [updateInternshipEngagement] = useMutation(
    UpdateInternshipEngagementDocument
  );
  const [updateLanguageEngagement] = useMutation(
    UpdateLanguageEngagementDocument
  );
  const updateEngagement =
    engagement.__typename === 'InternshipEngagement'
      ? updateInternshipEngagement
      : updateLanguageEngagement;

  const initialValues = useMemo(() => {
    const fullInitialValuesFields: Except<
      EngagementFormValues['engagement'],
      'id'
    > = {
      startDateOverride: engagement.startDateOverride.value,
      endDateOverride: engagement.endDateOverride.value,
      completeDate: engagement.completeDate.value,
      disbursementCompleteDate: engagement.disbursementCompleteDate.value,
      communicationsCompleteDate: engagement.communicationsCompleteDate.value,
      ...(engagement.__typename === 'LanguageEngagement'
        ? {
            lukePartnership: engagement.lukePartnership.value,
            firstScripture: engagement.firstScripture.value,
            paratextRegistryId: engagement.paratextRegistryId.value,
          }
        : engagement.__typename === 'InternshipEngagement'
        ? {
            methodologies: engagement.methodologies.value,
            position: engagement.position.value,
            mentorId: engagement.mentor.value,
            countryOfOriginId: engagement.countryOfOrigin.value,
          }
        : {}),
    };

    // Filter out irrelevant initial values so they don't get added to the mutation
    const filteredInitialValuesFields = pick(
      fullInitialValuesFields,
      editFields
    );

    return {
      engagement: {
        id: engagement.id,
        ...filteredInitialValuesFields,
      },
    };
  }, [editFields, engagement]);

  return (
    <DialogForm
      title="Update Engagement"
      closeLabel="Close"
      submitLabel="Save"
      DialogProps={{
        maxWidth: 'xs',
        fullWidth: true,
      }}
      {...props}
      initialValues={initialValues}
      onSubmit={async ({
        engagement: { mentorId: mentor, countryOfOriginId: country, ...rest },
      }) => {
        const mentorId = mentor?.id;
        const countryOfOriginId = country?.id;
        const input = {
          engagement: {
            ...rest,
            ...(mentorId ? { mentorId } : {}),
            ...(countryOfOriginId ? { countryOfOriginId } : {}),
          },
        };

        await updateEngagement({ variables: { input } });
      }}
    >
      <SubmitError />
      <FieldGroup prefix="engagement">{fields}</FieldGroup>
    </DialogForm>
  );
};
