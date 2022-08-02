import { CreateProjectInput, ProjectTypeList } from '~/api/schema.graphql';
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
      defaultValue="Translation"
      required
      variant="toggle-grouped"
    />
  </DialogForm>
);
