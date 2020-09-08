import { pick, startCase } from 'lodash';
import React, { ComponentType, FC, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import {
  displayEngagementStatus,
  displayInternPosition,
  EngagementStatusList,
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
import { AutocompleteField } from '../../../components/form/AutocompleteField';
import { CountryField, UserField } from '../../../components/form/Lookup';
import { UserLookupItemFragment } from '../../../components/form/Lookup/User/UserLookup.generated';
import { ExtractStrict, many, Many } from '../../../util';
import { InternshipEngagementDetailFragment as InternshipEngagement } from '../InternshipEngagement/InternshipEngagement.generated';
import { LanguageEngagementDetailFragment as LanguageEngagement } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import {
  useUpdateInternshipEngagementMutation,
  useUpdateLanguageEngagementMutation,
} from './EditEngagementDialog.generated';

type Engagement = InternshipEngagement | LanguageEngagement;

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
  | 'status'
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
    <CheckboxesField {...props} label="Methodologies">
      {Object.keys(MethodologyToApproach).map((group) => (
        <CheckboxOption key={group} label={startCase(group)} value={group} />
      ))}
    </CheckboxesField>
  ),
  position: ({ props }) => (
    <RadioField {...props} label="Intern Position">
      {InternshipEngagementPositionList.map((position) => (
        <RadioOption
          key={position}
          label={displayInternPosition(position)}
          value={position}
        />
      ))}
    </RadioField>
  ),
  countryOfOriginId: ({ props }) => (
    <CountryField {...props} label="Country of Origin" />
  ),
  mentorId: ({ props }) => <UserField {...props} label="Mentor" />,
  firstScripture: ({ props }) => (
    <CheckboxField {...props} label="First Scripture" />
  ),
  lukePartnership: ({ props }) => (
    <CheckboxField {...props} label="Luke Partnership" />
  ),
  status: ({ props }) => (
    <AutocompleteField
      label="Engagement Status"
      required
      {...props}
      options={EngagementStatusList}
      getOptionLabel={displayEngagementStatus}
      variant="outlined"
      autoComplete
    />
  ),
};

interface EngagementFormValues {
  engagement: Merge<
    UpdateLanguageEngagement & UpdateInternshipEngagement,
    {
      mentorId?: UserLookupItemFragment | null;
      countryOfOriginId?: DisplayCountryFragment | null;
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

  const [updateInternshipEngagement] = useUpdateInternshipEngagementMutation();
  const [updateLanguageEngagement] = useUpdateLanguageEngagementMutation();
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
      status: engagement.status,
      ...(engagement.__typename === 'LanguageEngagement'
        ? {
            lukePartnership: engagement.lukePartnership.value,
            firstScripture: engagement.firstScripture.value,
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
