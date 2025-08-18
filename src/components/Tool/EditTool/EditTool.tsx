import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except, SetRequired } from 'type-fest';
import { UpdateTool } from '~/api/schema.graphql';
import { ToolForm, ToolFormProps } from '../ToolForm/ToolForm';
import { ToolFormFragment } from '../ToolForm/ToolForm.graphql';
import { UpdateToolDocument } from './EditTool.graphql';

export type EditToolProps = Except<
  ToolFormProps<UpdateTool, ToolFormFragment>,
  'onSubmit' | 'initialValues'
>;

export const EditTool = (props: SetRequired<EditToolProps, 'tool'>) => {
  const [updateTool] = useMutation(UpdateToolDocument);
  const { tool } = props;

  const initialValues = useMemo(
    () => ({
      tool: {
        id: tool.id,
        name: tool.name.value,
        aiBased: tool.aiBased.value ?? false,
      },
    }),
    [tool]
  );

  return (
    <ToolForm<UpdateTool, ToolFormFragment>
      {...props}
      title="Edit Tool"
      initialValues={initialValues}
      onSubmit={async ({ tool: values }) => {
        const input: UpdateTool = {
          id: values.id,
          name: values.name,
          aiBased: values.aiBased,
        };

        const { data } = await updateTool({
          variables: { input },
        });

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        return data!.updateTool.tool;
      }}
    />
  );
};
