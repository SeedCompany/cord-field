import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { ToolForm, ToolFormProps } from '../ToolForm/ToolForm';
import { ToolFormFragment } from '../ToolForm/ToolForm.graphql';
import { CreateToolDocument } from './CreateTool.graphql';

export type CreateToolProps = Except<
  ToolFormProps<ToolFormFragment>,
  'onSubmit'
>;

export const CreateTool = (props: CreateToolProps) => {
  const [createTool] = useMutation(CreateToolDocument);

  return (
    <ToolForm
      {...props}
      title="Create Tool"
      onSubmit={async (input) => {
        const { data } = await createTool({
          variables: { input },
        });
        return data!.createTool.tool;
      }}
    />
  );
};
