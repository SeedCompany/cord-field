import { CreateTool } from '~/api/schema.graphql.ts';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { SecuredField, SubmitError, TextField } from '../../form';
import { CheckboxField } from '../../form/CheckboxField';
import { ToolFormFragment } from './ToolForm.graphql.ts';

export type ToolFormProps<R> = DialogFormProps<Required<CreateTool>, R> & {
  tool?: ToolFormFragment;
};

export const ToolForm = <R,>({ tool, ...rest }: ToolFormProps<R>) => (
  <DialogForm {...rest}>
    <SubmitError />
    <SecuredField obj={tool} name="name">
      {(props) => (
        <TextField
          {...props}
          label="Tool Name"
          placeholder="Enter tool name"
          required
        />
      )}
    </SecuredField>
    <SecuredField obj={tool} name="description">
      {(props) => (
        <TextField
          {...props}
          label="Description"
          placeholder="Brief description of this tool"
          multiline
          minRows={2}
        />
      )}
    </SecuredField>
    <SecuredField obj={tool} name="aiBased">
      {(props) => (
        <CheckboxField
          {...props}
          label="AI Based"
          helperText="Check if this tool uses artificial intelligence"
          defaultValue={false}
        />
      )}
    </SecuredField>
  </DialogForm>
);
