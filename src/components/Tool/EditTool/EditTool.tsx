import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except, SetRequired } from 'type-fest';
import { ToolForm, ToolFormProps } from '../ToolForm/ToolForm';
import { ToolFormFragment } from '../ToolForm/ToolForm.graphql';
import { EditToolDocument } from './EditTool.graphql';

export type EditToolProps = SetRequired<
  Except<ToolFormProps<ToolFormFragment>, 'onSubmit' | 'initialValues'>,
  'tool'
>;

export const EditTool = (props: EditToolProps) => {
  const { tool } = props;

  const [updateTool] = useMutation(EditToolDocument);

  const initialValues = useMemo(
    () => ({
      name: tool.name.value!,
      aiBased: tool.aiBased.value!,
    }),
    [tool]
  );

  return (
    <ToolForm
      {...props}
      title="Edit Tool"
      initialValues={initialValues}
      onSubmit={async (values) => {
        const { data } = await updateTool({
          variables: {
            input: {
              id: tool.id,
              ...values,
            },
          },
        });
        return data!.updateTool.tool;
      }}
    />
  );
};
