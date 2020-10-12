import { pick } from 'lodash';
import React, { ComponentType, useMemo } from 'react';
import { Except, Merge } from 'type-fest';
import { UpdateProject } from '../../../api';
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
  FieldGroup,
  SubmitError,
  TextField,
} from '../../../components/form';
import {
  FieldRegionField,
  LocationField,
} from '../../../components/form/Lookup';
import { ExtractStrict, many, Many } from '../../../util';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.generated';
import { useUpdateProjectMutation } from './UpdateProject.generated';

export type EditableProjectField = ExtractStrict<
  keyof UpdateProject,
  // Add more fields here as needed
  | 'name'
  | 'mouStart'
  | 'mouEnd'
  | 'estimatedSubmission'
  | 'fieldRegionId'
  | 'primaryLocationId'
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
  mouStart: ({ props }) => <DateField {...props} label="Start Date" />,
  mouEnd: ({ props }) => <DateField {...props} label="End Date" />,
  estimatedSubmission: ({ props }) => (
    <DateField {...props} label="Estimated Submission Date" />
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
};

export const UpdateProjectDialog = ({
  project,
  editFields: editFieldsProp,
  ...props
}: UpdateProjectDialogProps) => {
  const editFields = useMemo(() => many(editFieldsProp ?? []), [
    editFieldsProp,
  ]);

  const [updateProject] = useUpdateProjectMutation();

  const initialValues = useMemo(() => {
    const fullInitialValuesFields: Except<
      UpdateProjectFormValues['project'],
      'id'
    > = {
      name: project.name.value,
      primaryLocationId: project.primaryLocation.value,
      fieldRegionId: project.fieldRegion.value,
      mouStart: project.mouStart.value,
      mouEnd: project.mouEnd.value,
      estimatedSubmission: project.estimatedSubmission.value,
    };

    // Filter out irrelevant initial values so they don't get added to the mutation
    const filteredInitialValuesFields = pick(
      fullInitialValuesFields,
      editFields
    );

    return {
      project: {
        id: project.id,
        ...filteredInitialValuesFields,
      },
    };
  }, [
    editFields,
    project.id,
    project.name.value,
    project.primaryLocation.value,
    project.fieldRegion.value,
    project.mouEnd.value,
    project.mouStart.value,
    project.estimatedSubmission.value,
  ]);

  return (
    <DialogForm<UpdateProjectFormValues>
      title="Update Project"
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      initialValues={initialValues}
      onSubmit={async ({
        project: {
          primaryLocationId: primaryLocation,
          fieldRegionId: fieldRegion,
          ...rest
        },
      }) => {
        const primaryLocationId = primaryLocation?.id;
        const fieldRegionId = fieldRegion?.id;
        const input = {
          project: {
            ...rest,
            ...(primaryLocationId ? { primaryLocationId } : {}),
            ...(fieldRegionId ? { fieldRegionId } : {}),
          },
        };
        await updateProject({ variables: { input } });
      }}
    >
      <SubmitError />
      <FieldGroup prefix="project">
        {editFields.map((name) => {
          const Field = fieldMapping[name];
          return <Field props={{ name }} project={project} key={name} />;
        })}
      </FieldGroup>
    </DialogForm>
  );
};
