import { useMutation } from '@apollo/client';
import { setIn } from 'final-form';
import { compact, keyBy, pick, startCase } from 'lodash';
import { ComponentType, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import { addItemToList, invalidateProps } from '~/api';
import {
  InternshipDomainLabels,
  InternshipPositionLabels,
  InternshipProgramLabels,
  UpdateInternshipEngagement,
  UpdateLanguageEngagement,
} from '~/api/schema.graphql';
import {
  callAll,
  DisplayLocationFragment,
  ExtractStrict,
  labelFrom,
  Many,
  many,
  MethodologyToApproach,
} from '~/common';
import {
  Id_InternshipProject_Fragment as InternshipProjectIdFragment,
  Id_TranslationProject_Fragment as TranslationProjectIdFragment,
} from '~/common/fragments';
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
import {
  LanguageField,
  LanguageLookupItem,
  LocationField,
  UserField,
} from '../../../components/form/Lookup';
import { UserLookupItemFragment } from '../../../components/form/Lookup/User/UserLookup.graphql';
import { InternshipEngagementDetailFragment as InternshipEngagement } from '../InternshipEngagement/InternshipEngagement.graphql';
import { recalculateSensitivity } from '../LanguageEngagement/Create/recalculateSensitivity';
import { LanguageEngagementDetailFragment as LanguageEngagement } from '../LanguageEngagement/LanguageEngagementDetail.graphql';
import {
  UpdateInternshipEngagementDocument,
  UpdateInternshipEngagementMutation,
  UpdateLanguageEngagementDocument,
  UpdateLanguageEngagementMutation,
} from './EditEngagementDialog.graphql';

export type Engagement = InternshipEngagement | LanguageEngagement;

export type EditableEngagementField = ExtractStrict<
  | SecuredEditableKeys<LanguageEngagement>
  | SecuredEditableKeys<InternshipEngagement>,
  // Add more fields here as needed
  | 'dateRangeOverride'
  | 'completeDate'
  | 'disbursementCompleteDate'
  | 'methodologies'
  | 'position'
  | 'countryOfOriginId'
  | 'mentorId'
  | 'internId'
  | 'firstScripture'
  | 'lukePartnership'
  | 'paratextRegistryId'
  | 'openToInvestorVisit'
  | 'languageId'
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
  dateRangeOverride: ({ props }) => (
    <>
      <DateField
        {...props}
        name="startDateOverride"
        label="Start Date"
        helperText="Leave blank to use project's start date"
      />
      <DateField
        {...props}
        name="endDateOverride"
        label="End Date"
        helperText="Leave blank to use project's end date"
      />
    </>
  ),
  languageId: ({ props }) => <LanguageField {...props} label="Language" />,
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
            labelFrom(InternshipProgramLabels)(option?.program),
            labelFrom(InternshipDomainLabels)(option?.domain),
          ]).join(' - ');
        }}
        getOptionLabel={labelFrom(InternshipPositionLabels)}
      />
    );
  },
  countryOfOriginId: ({ props }) => (
    <LocationField {...props} label="Country of Origin" />
  ),
  mentorId: ({ props }) => <UserField {...props} label="Mentor" />,
  internId: ({ props }) => <UserField {...props} label="Intern" />,
  firstScripture: ({ props }) => (
    <CheckboxField {...props} label="First Scripture" keepHelperTextSpacing />
  ),
  lukePartnership: ({ props }) => (
    <CheckboxField {...props} label="Luke Partnership" />
  ),
  openToInvestorVisit: ({ props }) => (
    <CheckboxField {...props} label="Open to Investor Visitor" />
  ),
  paratextRegistryId: ({ props }) => (
    <TextField {...props} label="Paratext Registry ID" />
  ),
};

interface EngagementFormValues {
  engagement: Merge<
    UpdateLanguageEngagement & UpdateInternshipEngagement,
    {
      languageId?: LanguageLookupItem | null;
      mentorId?: UserLookupItemFragment | null;
      internId?: UserLookupItemFragment | null;
      countryOfOriginId?: DisplayLocationFragment | null;
    }
  >;
}

type ProjectIdFragment =
  | TranslationProjectIdFragment
  | InternshipProjectIdFragment;

export type EditEngagementDialogProps = Except<
  DialogFormProps<EngagementFormValues>,
  'onSubmit' | 'initialValues'
> & {
  engagement: Engagement;
  project: ProjectIdFragment;
  editFields?: Many<EditableEngagementField>;
};

export const EditEngagementDialog = ({
  engagement,
  editFields: editFieldsProp,
  project,
  ...props
}: EditEngagementDialogProps) => {
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
      startDateOverride: engagement.dateRangeOverride.value.start,
      endDateOverride: engagement.dateRangeOverride.value.end,
      completeDate: engagement.completeDate.value,
      disbursementCompleteDate: engagement.disbursementCompleteDate.value,
      ...(engagement.__typename === 'LanguageEngagement'
        ? {
            lukePartnership: engagement.lukePartnership.value,
            firstScripture: engagement.firstScripture.value,
            paratextRegistryId: engagement.paratextRegistryId.value,
            openToInvestorVisit: engagement.openToInvestorVisit.value,
            languageId: engagement.language.value,
          }
        : {
            methodologies: engagement.methodologies.value,
            position: engagement.position.value,
            mentorId: engagement.mentor.value,
            internId: engagement.intern.value,
            countryOfOriginId: engagement.countryOfOrigin.value,
          }),
    };

    // Filter out irrelevant initial values so they don't get added to the mutation
    const filteredInitialValuesFields = pick(
      fullInitialValuesFields,
      editFields.flatMap((field) =>
        field === 'dateRangeOverride'
          ? ['startDateOverride', 'endDateOverride']
          : field
      )
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
      validate={(values) => {
        const start = values.engagement.startDateOverride;
        const end = values.engagement.endDateOverride;

        if (start && end) {
          if (start > end) {
            return {
              engagement: {
                startDateOverride: 'Start date should come before end date',
                endDateOverride: 'End date should come after start date',
              },
            };
          }
          return undefined;
        }

        if (
          start &&
          engagement.dateRange.value.end &&
          start > engagement.dateRange.value.end
        ) {
          return {
            engagement: {
              startDateOverride: `Start date should come before project's end date`,
            },
          };
        }

        if (
          end &&
          engagement.dateRange.value.start &&
          end < engagement.dateRange.value.start
        ) {
          return {
            engagement: {
              endDateOverride: `End date should come after project's start date`,
            },
          };
        }
      }}
      onSubmit={async (
        {
          engagement: {
            internId: intern,
            mentorId: mentor,
            countryOfOriginId: country,
            languageId: language,
            ...rest
          },
        },
        form
      ) => {
        const languageId = language?.id;
        const mentorId = mentor?.id;
        const internId = intern?.id;
        const countryOfOriginId = country?.id;
        const input = {
          engagement: {
            ...rest,
            ...(internId ? { internId } : {}),
            ...(mentorId ? { mentorId } : {}),
            ...(languageId ? { languageId } : {}),
            ...(countryOfOriginId ? { countryOfOriginId } : {}),
          },
          changeset: engagement.changeset?.id,
        };

        const languageRef = languageId
          ? ({
              __typename: 'Language',
              id: languageId,
            } as const)
          : ({} as const);

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
            if (languageRef.id)
              callAll(
                addItemToList({
                  listId: [project, 'engagements'],
                  outputToItem: (res: UpdateLanguageEngagementMutation) =>
                    res.updateLanguageEngagement.engagement,
                }),
                addItemToList({
                  listId: [languageRef, 'projects'],
                  outputToItem: () => project,
                }),
                recalculateSensitivity(project)
              );

            if (internId)
              addItemToList({
                listId: [project, 'engagements'],
                outputToItem: (res: UpdateInternshipEngagementMutation) =>
                  res.updateInternshipEngagement.engagement,
              });
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
