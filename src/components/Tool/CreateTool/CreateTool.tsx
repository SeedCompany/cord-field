import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { type CreateTool as CreateToolType } from '~/api/schema.graphql';
import { ToolForm, ToolFormProps } from '../ToolForm/ToolForm';
import { ToolFormFragment } from '../ToolForm/ToolForm.graphql';
import { CreateToolDocument } from './CreateTool.graphql';

type SubmitResult = ToolFormFragment;

export type CreateToolProps = Except<
  ToolFormProps<CreateToolType, SubmitResult>,
  'onSubmit'
>;

export const CreateTool = (props: CreateToolProps) => {
  const [createTool] = useMutation(CreateToolDocument);

  return (
    <ToolForm<CreateToolType, SubmitResult>
      {...props}
      title="Create Tool"
      onSubmit={async (values) => {
        const input: CreateToolType = {
          name: values.tool.name,
          aiBased: values.tool.aiBased ?? false,
        };

        const { data } = await createTool({
          variables: { input },
        });

        return data!.createTool.tool;
      }}
    />
  );
};
