import { pick } from 'lodash';
import React, { ComponentType, useMemo } from 'react';
import { Except } from 'type-fest';
import {
  displayProjectStep,
  displayStatus,
  UpdateProject,
  UpdateProjectInput,
} from '../../../api';
import {
  DisplayFieldRegionFragment as FieldRegionLookupItem,
  DisplayLocationFragment as LocationLookupItem,
} from '../../../api/fragments/location.generated';
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
import {
  FieldRegionField,
  LocationField,
} from '../../../components/form/Lookup';
import { ExtractStrict, many, Many } from '../../../util';
import { ProjectOverviewFragment } from '../Overview/ProjectOverview.generated';
import { useUpdateProjectMutation } from './UpdateProject.generated';

// For when we need to use a different type in the form than
// we eventually submit.
// Add more fields here as needed.
type ExcludedFieldNames = 'primaryLocationId' | 'fieldRegionId';
type RemappedFieldNames = 'primaryLocation' | 'fieldRegion';
interface RemappedFields {
  primaryLocation?: LocationLookupItem | null | undefined;
  fieldRegion?: FieldRegionLookupItem | null | undefined;
}
interface RemappedUpdateProjectInput {
  project: Except<UpdateProjectInput['project'], ExcludedFieldNames> &
    RemappedFields;
}

export type EditableProjectField =
  | ExtractStrict<
      keyof UpdateProject,
      // Add more fields here as needed
      'name' | 'step' | 'mouStart' | 'mouEnd' | 'estimatedSubmission'
    >
  | RemappedFieldNames;

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
  primaryLocation: ({ props }) => (
    <LocationField {...props} label="Project Location" />
  ),
  fieldRegion: ({ props }) => (
    <FieldRegionField {...props} label="Project Field Zone" />
  ),
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
  DialogFormProps<RemappedUpdateProjectInput>,
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
    const fullInitialValuesFields: RemappedFields &
      Except<UpdateProjectInput['project'], 'id' | ExcludedFieldNames> = {
      name: project.name.value,
      step: project.step.value,
      primaryLocation: project.primaryLocation.value,
      fieldRegion: project.fieldRegion.value,
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
    project.step.value,
    project.estimatedSubmission.value,
  ]);

  return (
    <DialogForm<RemappedUpdateProjectInput>
      title="Update Project"
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      initialValues={initialValues}
      onSubmit={async (remappedInput) => {
        const {
          project: { primaryLocation, fieldRegion, ...projectFields },
        } = remappedInput;
        const input = {
          ...remappedInput,
          project: {
            ...projectFields,
            ...(primaryLocation?.id
              ? { primaryLocationId: primaryLocation.id }
              : null),
            ...(fieldRegion?.id ? { fieldRegionId: fieldRegion.id } : null),
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
