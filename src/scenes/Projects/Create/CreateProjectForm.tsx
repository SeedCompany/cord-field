import {
  CreateProject,
  ProjectTypeLabels,
  ProjectTypeList,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { EnumField, SubmitError, TextField } from '../../../components/form';

export type CreateProjectFormProps = DialogFormProps<CreateProject>;

export const CreateProjectForm = (props: CreateProjectFormProps) => (
  <DialogForm {...props} title="Create Project">
    <SubmitError />
    <TextField
      name="name"
      label="Name"
      placeholder="Enter project name"
      required
    />
    <EnumField
      name="type"
      label="Type"
      options={ProjectTypeList}
      getLabel={labelFrom(ProjectTypeLabels)}
      defaultValue={ProjectTypeList[0]}
      required
      variant="toggle-grouped"
    />
  </DialogForm>
);
