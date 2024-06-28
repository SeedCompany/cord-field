import { useMutation } from '@apollo/client';
import { many, Many } from '@seedcompany/common';
import { pick } from 'lodash';
import { ComponentType, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import { invalidateProps } from '~/api';
import { SensitivityList, UpdateProject } from '~/api/schema.graphql';
import {
  DisplayFieldRegionFragment,
  DisplayLocationFragment,
  ExtractStrict,
} from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  DateField,
  EnumField,
  FieldGroup,
  SecuredField,
  SubmitError,
  TextField,
} from '../../../components/form';
import {
  FieldRegionField,
  LocationField,
} from '../../../components/form/Lookup';
import {
  updateEngagementDateRanges,
  updatePartnershipsDateRanges,
} from '../DateRangeCache';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.graphql';
import { UpdateProjectDocument } from './UpdateProject.graphql';

export type EditableProjectField = ExtractStrict<
  keyof UpdateProject | 'mouRange',
  // Add more fields here as needed
  | 'name'
  | 'mouRange'
  | 'estimatedSubmission'
  | 'fieldRegionOverrideId'
  | 'primaryLocationId'
  | 'sensitivity'
  | 'marketingCountryOverrideId'
  | 'marketingRegionOverrideId'
>;

interface ProjectFieldProps {
  props: {
    name: string;
  };
  project: ProjectOverviewFragment;
}

const fieldMapping: Record<
  EditableProjectField,
  ComponentType<ProjectFieldProps>
> = {
  name: ({ props }) => <TextField {...props} label="Project Name" />,
  primaryLocationId: ({ props }) => (
    <LocationField {...props} label="Primary Location" />
  ),
  fieldRegionOverrideId: ({ props }) => (
    <FieldRegionField {...props} label="Field Region" />
  ),
  mouRange: ({ props }) => (
    <>
      <DateField {...props} name="mouStart" label="Start Date" />
      <DateField {...props} name="mouEnd" label="End Date" />
    </>
  ),
  estimatedSubmission: ({ props }) => (
    <DateField {...props} label="Estimated Submission Date" />
  ),
  sensitivity: ({ props }) => (
    <EnumField {...props} label="Sensitivity" options={SensitivityList} />
  ),
  marketingCountryOverrideId: ({ props }) => (
    <LocationField {...props} label="Marketing Country" />
  ),
  marketingRegionOverrideId: ({ props }) => (
    <LocationField {...props} label="Marketing Region" />
  ),
};

interface UpdateProjectFormValues {
  project: Merge<
    UpdateProject,
    {
      primaryLocationId?: DisplayLocationFragment | null;
      fieldRegionOverrideId?: DisplayFieldRegionFragment | null;
      marketingCountryOverrideId?: DisplayLocationFragment | null;
      marketingRegionOverrideId?: DisplayLocationFragment | null;
    }
  >;
}

type UpdateProjectDialogProps = Except<
  DialogFormProps<UpdateProjectFormValues>,
  'onSubmit' | 'initialValues'
> & {
  project: ProjectOverviewFragment;
  editFields?: Many<EditableProjectField>;
  planChangeId?: string;
};

export const UpdateProjectDialog = ({
  project,
  editFields: editFieldsProp,
  ...props
}: UpdateProjectDialogProps) => {
  const editFields = useMemo(
    () => many(editFieldsProp ?? []),
    [editFieldsProp]
  );

  const [updateProject] = useMutation(UpdateProjectDocument);

  const initialValues = useMemo(() => {
    const fullInitialValuesFields: Except<
      UpdateProjectFormValues['project'],
      'id'
    > = {
      name: project.name.value,
      primaryLocationId: project.primaryLocation.value,
      fieldRegionOverrideId: project.fieldRegionOverride.value,
      mouStart: project.mouRange.value.start,
      mouEnd: project.mouRange.value.end,
      estimatedSubmission: project.estimatedSubmission.value,
      sensitivity: project.sensitivity,
      marketingCountryOverrideId: project.marketingCountryOverride.value,
      marketingRegionOverrideId: project.marketingRegionOverride.value,
    };

    // Filter out irrelevant initial values so they don't get added to the mutation
    const filteredInitialValuesFields = pick(
      fullInitialValuesFields,
      editFields.flatMap((field) =>
        field === 'mouRange' ? ['mouStart', 'mouEnd'] : field
      )
    );

    return {
      project: {
        id: project.id,
        ...filteredInitialValuesFields,
      },
    };
  }, [
    project.name.value,
    project.primaryLocation.value,
    project.fieldRegionOverride.value,
    project.mouRange.value.start,
    project.mouRange.value.end,
    project.estimatedSubmission.value,
    project.sensitivity,
    project.marketingCountryOverride.value,
    project.marketingRegionOverride.value,
    project.id,
    editFields,
  ]);

  return (
    <DialogForm<UpdateProjectFormValues>
      title="Update Project"
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      // Only simple properties are changeset aware, relationships are not.
      changesetAware={editFields.every((field) => !field.endsWith('Id'))}
      initialValues={initialValues}
      validate={(values) => {
        const start = values.project.mouStart;
        const end = values.project.mouEnd;

        if (start && end && start > end) {
          return {
            project: {
              mouStart: 'Start date should come before end date',
              mouEnd: 'End date should come after start date',
            },
          };
        }

        return undefined;
      }}
      onSubmit={async ({ project: data }, form) => {
        const { dirtyFields } = form.getState();
        await updateProject({
          variables: {
            input: {
              project: {
                ...data,
                primaryLocationId: dirtyFields['project.primaryLocationId']
                  ? data.primaryLocationId?.id ?? null
                  : undefined,
                fieldRegionOverrideId: dirtyFields[
                  'project.fieldRegionOverrideId'
                ]
                  ? data.fieldRegionOverrideId?.id ?? null
                  : undefined,
                marketingCountryOverrideId: dirtyFields[
                  'project.marketingCountryOverrideId'
                ]
                  ? data.marketingCountryOverrideId?.id ?? null
                  : undefined,
                marketingRegionOverrideId: dirtyFields[
                  'project.marketingRegionOverrideId'
                ]
                  ? data.marketingRegionOverrideId?.id ?? null
                  : undefined,
              },
              changeset: project.changeset?.id,
            },
          },
          update: (cache) => {
            if (data.mouStart === undefined && data.mouEnd === undefined) {
              return;
            }

            // Project date range affects budget records, remove them so
            // they are re-fetched when needed
            if (project.budget.value) {
              invalidateProps(cache, project.budget.value, 'records');
            }

            invalidateProps(cache, project, [
              'narrativeReports',
              'financialReports',
            ]);

            // Adjust cached date ranges of engagements & partnerships
            // since they are based on the project's date range
            updateEngagementDateRanges(cache, project);
            updatePartnershipsDateRanges(cache, project);
          },
        });
      }}
    >
      <SubmitError />
      <FieldGroup prefix="project">
        {editFields.map((name) => {
          const Field = fieldMapping[name];
          if (name === 'sensitivity') {
            return <Field props={{ name }} project={project} key={name} />;
          }
          return (
            <SecuredField obj={project} name={name} key={name}>
              {(props) => <Field props={props} project={project} />}
            </SecuredField>
          );
        })}
      </FieldGroup>
    </DialogForm>
  );
};
