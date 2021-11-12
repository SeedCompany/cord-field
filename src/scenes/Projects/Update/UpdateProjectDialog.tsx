import { useMutation } from '@apollo/client';
import { pick } from 'lodash';
import React, { ComponentType, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import { invalidateProps, SensitivityList, UpdateProject } from '../../../api';
import {
  DisplayFieldRegionFragment,
  DisplayLocationFragment,
} from '../../../api/fragments/location.generated';
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
import { ExtractStrict, many, Many } from '../../../util';
import {
  updateEngagementDateRanges,
  updatePartnershipsDateRanges,
} from '../DateRangeCache';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.generated';
import { UpdateProjectDocument } from './UpdateProject.generated';

export type EditableProjectField = ExtractStrict<
  keyof UpdateProject | 'mouRange',
  // Add more fields here as needed
  | 'name'
  | 'mouRange'
  | 'estimatedSubmission'
  | 'fieldRegionId'
  | 'primaryLocationId'
  | 'sensitivity'
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
  fieldRegionId: ({ props }) => (
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
};

interface UpdateProjectFormValues {
  project: Merge<
    UpdateProject,
    {
      primaryLocationId?: DisplayLocationFragment | null;
      fieldRegionId?: DisplayFieldRegionFragment | null;
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
      fieldRegionId: project.fieldRegion.value,
      mouStart: project.mouRange.value.start,
      mouEnd: project.mouRange.value.end,
      estimatedSubmission: project.estimatedSubmission.value,
      sensitivity: project.sensitivity,
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
    project.fieldRegion.value,
    project.mouRange.value.start,
    project.mouRange.value.end,
    project.estimatedSubmission.value,
    project.sensitivity,
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
      onSubmit={async ({
        project: {
          primaryLocationId: primaryLocation,
          fieldRegionId: fieldRegion,
          ...rest
        },
      }) => {
        await updateProject({
          variables: {
            input: {
              project: {
                ...rest,
                primaryLocationId: primaryLocation?.id ?? null,
                fieldRegionId: fieldRegion?.id ?? null,
              },
              changeset: project.changeset?.id,
            },
          },
          update: (cache) => {
            if (rest.mouStart === undefined && rest.mouEnd === undefined) {
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
