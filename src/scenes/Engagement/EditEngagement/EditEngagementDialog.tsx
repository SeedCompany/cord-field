import { pick, startCase } from 'lodash';
import React, { ComponentType, FC } from 'react';
import { Except, Merge } from 'type-fest';
import {
  displayInternPosition,
  InternshipEngagementPositionList,
  MethodologyToApproach,
  UpdateInternshipEngagement,
  UpdateLanguageEngagement,
} from '../../../api';
import { DisplayCountryFragment } from '../../../api/fragments/location.generated';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxesField,
  CheckboxField,
  CheckboxOption,
  DateField,
  FieldGroup,
  RadioField,
  RadioOption,
  SubmitError,
} from '../../../components/form';
import { CountryField, UserField } from '../../../components/form/Lookup';
import { UserLookupItemFragment } from '../../../components/form/Lookup/User/UserLookup.generated';
import { many, Many } from '../../../util';
import { InternshipEngagementDetailFragment as InternshipEngagement } from '../InternshipEngagement/InternshipEngagement.generated';
import { LanguageEngagementDetailFragment as LanguageEngagement } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import {
  useUpdateInternshipEngagementMutation,
  useUpdateLanguageEngagementMutation,
} from './EditEngagementDialog.generated';

type Engagement = InternshipEngagement | LanguageEngagement;
type EngagementKeys = keyof InternshipEngagement | keyof LanguageEngagement;

interface EngagementFieldProps {
  engagement: Engagement;
}

const fieldMapping = {
  startDate: () => <DateField name="startDate" label="Start Date" />,
  endDate: () => <DateField name="endDate" label="End Date" />,
  completeDate: ({ engagement }: EngagementFieldProps) => (
    <DateField
      name="completeDate"
      label={
        engagement.__typename === 'InternshipEngagement'
          ? 'Growth Plan Complete Date'
          : 'Translation Complete Date'
      }
    />
  ),
  disbursementCompleteDate: () => (
    <DateField
      name="disbursementCompleteDate"
      label="Disbursement Complete Date"
    />
  ),
  communicationsCompleteDate: () => (
    <DateField
      name="communicationsCompleteDate"
      label="Communications Complete Date"
    />
  ),
  methodologies: () => (
    <CheckboxesField name="methodologies" label="Methodologies">
      {Object.keys(MethodologyToApproach).map((group) => (
        <CheckboxOption key={group} label={startCase(group)} value={group} />
      ))}
    </CheckboxesField>
  ),
  position: () => (
    <RadioField name="position" label="Intern Position">
      {InternshipEngagementPositionList.map((position) => (
        <RadioOption
          key={position}
          label={displayInternPosition(position)}
          value={position}
        />
      ))}
    </RadioField>
  ),
  countryOfOrigin: () => (
    <CountryField name="countryOfOriginId" label="Country of Origin" />
  ),
  mentor: () => <UserField name="mentorId" label="Mentor" />,
  firstScripture: () => (
    <CheckboxField name="firstScripture" label="First Scripture" />
  ),
  lukePartnership: () => (
    <CheckboxField name="lukePartnership" label="Luke Partnership" />
  ),
};

export type EditableEngagementField = keyof typeof fieldMapping;

// Asserts the above mapping's keys & values are valid fields & components
// By not declaring/enforcing the type on field mapping TS infers the type,
// which allows us to define EditableEngagementField. Doing so we can strictly
// define which fields are editable without having to duplicate the field keys.
// I spent hours trying to get TS both enforce/constrain the shape while also
// inferring the actual result with no success. The above solution isn't the best
// DX either, keys are not autocompleted, props have to be explicitly defined,
// but at least the strict typing works.
const _assertMapping: Partial<
  Record<EngagementKeys, ComponentType<EngagementFieldProps>>
> &
  Record<
    Exclude<EditableEngagementField, EngagementKeys>,
    never
  > = fieldMapping;

interface EngagementFormValues {
  engagement: Merge<
    UpdateLanguageEngagement & UpdateInternshipEngagement,
    {
      mentorId?: UserLookupItemFragment;
      countryOfOriginId?: DisplayCountryFragment;
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
  const editFields = many(editFieldsProp ?? []);

  const fields = editFields.map((field) => {
    const Field = fieldMapping[field];
    return <Field engagement={engagement} key={field} />;
  });

  const [updateInternshipEngagement] = useUpdateInternshipEngagementMutation();
  const [updateLanguageEngagement] = useUpdateLanguageEngagementMutation();
  const updateEngagement =
    engagement.__typename === 'InternshipEngagement'
      ? updateInternshipEngagement
      : updateLanguageEngagement;

  const fullInitialValues = {
    startDate: engagement.startDate.value,
    endDate: engagement.endDate.value,
    completeDate: engagement.completeDate.value,
    disbursementCompleteDate: engagement.disbursementCompleteDate.value,
    communicationsCompleteDate: engagement.communicationsCompleteDate.value,
    ...(engagement.__typename === 'LanguageEngagement'
      ? {
          lukePartnership: engagement.lukePartnership.value,
          firstScripture: engagement.firstScripture.value,
        }
      : engagement.__typename === 'InternshipEngagement'
      ? {
          methodologies: engagement.methodologies.value,
          position: engagement.position.value,
        }
      : {}),
  };

  // Filter out irrelevant initial values so they don't get added to the mutation
  const filteredInitialValues = pick(fullInitialValues, editFields);

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
      initialValues={{
        engagement: {
          id: engagement.id,
          ...filteredInitialValues,
        },
      }}
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
