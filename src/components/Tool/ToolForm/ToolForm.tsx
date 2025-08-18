import { Merge } from 'type-fest';
import { CreateTool, UpdateTool } from '~/api/schema.graphql';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { SecuredField, SubmitError, TextField } from '../../form';
import { CheckboxField } from '../../form/CheckboxField';
import { ToolFormFragment } from './ToolForm.graphql';

type ToolMutation = UpdateTool | CreateTool;

export interface ToolFormValues<Mutation extends ToolMutation> {
  tool: Merge<Mutation, Record<string, any>>;
}

export type ToolFormProps<Mutation extends ToolMutation, R> = DialogFormProps<
  ToolFormValues<Mutation>,
  R
> & {
  tool?: ToolFormFragment;
};

export const ToolForm = <Mutation extends ToolMutation, R>({
  tool,
  ...rest
}: ToolFormProps<Mutation, R>) => (
  <DialogForm {...rest} fieldsPrefix="tool">
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
    <SecuredField obj={tool} name="aiBased">
      {(props) => (
        <CheckboxField
          {...props}
          label="AI Based"
          helperText="Check if this tool uses artificial intelligence"
        />
      )}
    </SecuredField>
  </DialogForm>
);
