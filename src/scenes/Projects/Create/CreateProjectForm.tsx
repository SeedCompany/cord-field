import {
  CreateProjectInput,
  ProjectTypeLabels,
  ProjectTypeList,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { EnumField, SubmitError, TextField } from '../../../components/form';

export type CreateProjectFormProps = DialogFormProps<CreateProjectInput>;

export const CreateProjectForm = (props: CreateProjectFormProps) => (
  <DialogForm {...props} title="Create Project">
    <SubmitError />
    <TextField
      name="project.name"
      label="Name"
      placeholder="Enter project name"
      required
    />
    <EnumField
      name="project.type"
      label="Type"
      options={ProjectTypeList}
      getLabel={labelFrom(ProjectTypeLabels)}
      defaultValue={ProjectTypeList[0]}
      required
      variant="toggle-grouped"
    />
  </DialogForm>
);
