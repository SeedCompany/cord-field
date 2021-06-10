import { useMutation } from '@apollo/client';
import { setIn } from 'final-form';
import { compact, keyBy, pick, startCase } from 'lodash';
import React, { ComponentType, FC, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import {
  displayInternDomain,
  displayInternPosition,
  displayInternProgram,
  invalidateProps,
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
  SecuredEditableKeys,
  SecuredField,
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
  | SecuredEditableKeys<LanguageEngagement>
  | SecuredEditableKeys<InternshipEngagement>,
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
    <CheckboxField {...props} label="First Scripture" keepHelperTextSpacing />
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
  const editFields = useMemo(
    () => many(editFieldsProp ?? []),
    [editFieldsProp]
  );

  const fields = editFields.map((name) => {
    const Field = fieldMapping[name];
    return (
      <SecuredField
        obj={engagement}
        // @ts-expect-error this error comes from the fact that we are trying to
        // handle the union of both engagement type's fields. TS correctly
        // takes the intersection of keys instead of a union, which would be unsafe.
        // In this case, we verified that the keys are safe with EditableEngagementField
        // type and SecuredField also gracefully handles bad keys at runtime.
        name={name}
        key={name}
      >
        {(props) => <Field props={props} engagement={engagement} />}
      </SecuredField>
    );
  });

  const [updateEngagement] = useMutation(
    engagement.__typename === 'InternshipEngagement'
      ? UpdateInternshipEngagementDocument
      : UpdateLanguageEngagementDocument
  );

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
      onSubmit={async (
        {
          engagement: { mentorId: mentor, countryOfOriginId: country, ...rest },
        },
        form
      ) => {
        const mentorId = mentor?.id;
        const countryOfOriginId = country?.id;
        const input = {
          engagement: {
            ...rest,
            ...(mentorId ? { mentorId } : {}),
            ...(countryOfOriginId ? { countryOfOriginId } : {}),
          },
        };

        await updateEngagement({
          variables: { input },
          update: (cache) => {
            // Invalidate progress reports if engagement date range changes
            if (engagement.__typename === 'LanguageEngagement') {
              const dirty = form.getState().dirtyFields;
              if (
                'engagement.startDateOverride' in dirty ||
                'engagement.endDateOverride' in dirty
              ) {
                invalidateProps(cache, engagement, 'progressReports');
              }
            }
          },
        });
      }}
      errorHandlers={{
        Input: (e, next) =>
          e.field === 'languageEngagement.firstScripture'
            ? setIn(
                {},
                'engagement.firstScripture',
                'Language has already has first Scripture'
              )
            : next(e),
      }}
      fieldsPrefix="engagement"
    >
      <SubmitError />
      {fields}
    </DialogForm>
  );
};
