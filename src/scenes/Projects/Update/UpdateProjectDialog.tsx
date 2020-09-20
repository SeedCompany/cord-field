import { pick } from 'lodash';
import React, { ComponentType, useMemo } from 'react';
import { Except } from 'type-fest';
import {
  displayProjectStep,
  displayStatus,
  UpdateProject,
  UpdateProjectInput,
} from '../../../api';
import { projectStatusFromStep, projectSteps } from '../../../api/projectSteps';
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
import { AutocompleteField } from '../../../components/form/AutocompleteField';
import { ExtractStrict, many, Many } from '../../../util';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.generated';
import { useUpdateProjectMutation } from './UpdateProject.generated';

export type EditableProjectField = ExtractStrict<
  keyof UpdateProject,
  // Add more fields here as needed
  'name' | 'step' | 'mouStart' | 'mouEnd' | 'estimatedSubmission'
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
  mouStart: ({ props }) => <DateField {...props} label="Start Date" />,
  mouEnd: ({ props }) => <DateField {...props} label="End Date" />,
  estimatedSubmission: ({ props }) => (
    <DateField {...props} label="Estimated Submission Date" />
  ),
  step: ({ props }) => (
    <AutocompleteField
      label="Step"
      required
      {...props}
      options={projectSteps}
      groupBy={(step) => displayStatus(projectStatusFromStep[step])}
      getOptionLabel={displayProjectStep}
      variant="outlined"
      autoComplete
    />
  ),
};

type UpdateProjectDialogProps = Except<
  DialogFormProps<UpdateProjectInput>,
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
      UpdateProjectInput['project'],
      'id'
    > = {
      name: project.name.value,
      step: project.step.value,
      mouStart: project.mouStart.value,
      mouEnd: project.mouEnd.value,
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
    project.mouEnd.value,
    project.mouStart.value,
    project.step.value,
  ]);

  return (
    <DialogForm<UpdateProjectInput>
      title="Update Project"
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      initialValues={initialValues}
      onSubmit={async (input) => {
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
