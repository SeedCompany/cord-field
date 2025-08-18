import { useMutation } from '@apollo/client';
import { ReactNode } from 'react';
import { Except } from 'type-fest';
import { Entity } from '~/api';
import {
  CreateToolUsageFormValues,
  ToolUsageForm,
  ToolUsageFormProps,
} from '../ToolUsageForm/ToolUsageForm';
import { ToolUsageFormFragment } from '../ToolUsageForm/ToolUsageForm.graphql';
import { CreateToolUsageDocument } from './CreateToolUsage.graphql';

type SubmitResult = ToolUsageFormFragment;
export type CreateToolUsageProps = Except<
  ToolUsageFormProps<CreateToolUsageFormValues, SubmitResult>,
  'onSubmit'
> & {
  container: Entity;
  children?: ReactNode;
  dateFieldKey?: number;
};

export const CreateToolUsage = ({
  container,
  children,
  dateFieldKey,
  getOptionDisabled,
  ...props
}: CreateToolUsageProps) => {
  const [createToolUsage] = useMutation(CreateToolUsageDocument);

  return (
    <ToolUsageForm<CreateToolUsageFormValues, SubmitResult>
      title="Create Tool Usage"
      dateFieldKey={dateFieldKey}
      getOptionDisabled={getOptionDisabled}
      {...props}
      onSubmit={async ({ toolUsage: { toolLookupItem, ...rest } }) => {
        const { data } = await createToolUsage({
          variables: {
            input: {
              ...rest,
              container: container.id,
              tool: toolLookupItem.id,
            },
          },
        });

        return data!.createToolUsage.toolUsage;
      }}
    >
      {children}
    </ToolUsageForm>
  );
};
