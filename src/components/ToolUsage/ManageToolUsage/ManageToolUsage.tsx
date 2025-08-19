import { ApolloError, useMutation } from '@apollo/client';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { GraphQLError } from 'graphql';
import { useMemo, useState } from 'react';
import { CalendarDate, CalendarDateOrISO } from '../../../common';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { DateField, SubmitError } from '../../form';
import { ToolField, ToolLookupItem } from '../../form/Lookup';
import { CreateToolUsageDocument } from './CreateToolUsage.graphql';
import { DeleteToolUsageDocument } from './DeleteToolUsage.graphql';
import { ManageToolUsagesFragment } from './ToolUsageForm.graphql';

interface CreateToolUsageFormValues {
  startDate?: CalendarDateOrISO | null;
  tool: ToolLookupItem;
}

export interface ManageToolUsageProps
  extends Pick<DialogFormProps<CreateToolUsageFormValues>, 'open' | 'onClose'> {
  container: ManageToolUsagesFragment;
}

export const ManageToolUsage = ({
  container,
  onClose,
  ...props
}: ManageToolUsageProps) => {
  const usedToolIds = useMemo(
    () => new Set(container.tools.items.map(({ tool }) => tool.id)),
    [container]
  );
  const [today] = useState(CalendarDate.now);

  const [createToolUsage] = useMutation(CreateToolUsageDocument);
  const [deleteToolUsage] = useMutation(DeleteToolUsageDocument);

  return (
    <DialogForm<CreateToolUsageFormValues>
      title="Manage Tools"
      closeLabel="Close"
      submitLabel={container.tools.canCreate ? 'Add' : false}
      {...props}
      onSubmit={async (values, form) => {
        // A weird and verbose way to only show "tool is required error" on submit.
        // Since the tool field is autofocused, any time it is blurred it gets that error
        // which feels weird, since there is a lot more to do within this "form"/dialog.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!values.tool) {
          throw new ApolloError({
            graphQLErrors: [
              new GraphQLError('Required', {
                extensions: {
                  codes: ['Input'],
                  field: 'tool',
                },
              }),
            ],
          });
        }

        await createToolUsage({
          variables: {
            input: {
              ...values,
              container: container.id,
              tool: values.tool.id,
            },
          },
        });
        form.restart();
      }}
      onClose={(reason, form) => {
        if (reason === 'success') return; // Keep the dialog open on success
        onClose?.(reason, form);
      }}
    >
      <Stack gap={2}>
        {container.tools.items.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }} role="list">
            {container.tools.items.map((usage) => (
              <Chip
                key={usage.id}
                role="listitem"
                label={usage.tool.name.value}
                color="default"
                onDelete={
                  usage.canDelete
                    ? () =>
                        deleteToolUsage({
                          variables: { id: usage.id },
                          optimisticResponse: {
                            deleteToolUsage: {
                              __typename: 'DeleteToolUsageOutput',
                            },
                          },
                        })
                    : undefined
                }
                // TODO onClick to switch to editing the specific usage.
              />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">No tools used yet</Typography>
        )}

        {container.tools.canCreate && (
          <>
            <Divider />
            <Stack>
              <Typography variant="subtitle1" lineHeight={1} gutterBottom>
                Add Tool
              </Typography>

              <SubmitError />

              <ToolField
                name="tool"
                label="Tool"
                getOptionDisabled={(tool) => usedToolIds.has(tool.id)}
              />
              <DateField
                name="startDate"
                label="Start Date"
                helperText="When this tool usage begins"
                defaultValue={today}
              />
            </Stack>
          </>
        )}
      </Stack>
    </DialogForm>
  );
};
