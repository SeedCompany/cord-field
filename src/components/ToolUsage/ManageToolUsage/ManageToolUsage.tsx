import { ApolloError, Reference, useMutation } from '@apollo/client';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { cmpBy } from '@seedcompany/common';
import { useMemo, useState } from 'react';
import { CalendarDate, CalendarDateOrISO, ISOString } from '~/common';
import { readFragment } from '../../../api';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { DateField, SubmitError } from '../../form';
import { ToolField, ToolLookupItem } from '../../form/Lookup';
import {
  ToolLookupItemFragment,
  ToolLookupItemFragmentDoc,
} from '../../form/Lookup/Tool/ToolLookup.graphql';
import { CreateToolUsageDocument } from './CreateToolUsage.graphql';
import { DeleteToolUsageDocument } from './DeleteToolUsage.graphql';
import {
  ManageToolUsagesFragment,
  ToolUsageFormFragment,
} from './ToolUsageForm.graphql';

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

  const [createToolUsage, { client }] = useMutation(CreateToolUsageDocument, {
    optimisticResponse: ({ input }) => {
      const tool: ToolLookupItemFragment = readFragment(client.cache, {
        fragment: ToolLookupItemFragmentDoc,
        object: { __typename: 'Tool', id: input.tool },
        optimistic: true,
      })!;
      const newOptimisticUsage = {
        __typename: 'ToolUsage',
        id: input.tool, // fake but will be unique.
        tool,
        startDate: {
          __typename: 'SecuredDateNullable',
          canRead: true,
          canEdit: true,
          value:
            ((input.startDate as CalendarDate | null)?.toISO() as
              | ISOString
              | undefined) ?? null,
        },
        // We can't delete it because we don't have the real ID from the API
        // to delete with.
        canDelete: false,
      } as const;
      return {
        createToolUsage: {
          __typename: 'CreateToolUsageOutput',
          toolUsage: {
            ...newOptimisticUsage,
            container: {
              ...container,
              tools: {
                ...container.tools,
                items: [...container.tools.items, newOptimisticUsage],
              },
            },
          },
        },
      } as const;
    },
  });
  const [runDeleteToolUsage] = useMutation(DeleteToolUsageDocument);
  const deleteUsageFn = (usage: ToolUsageFormFragment) => {
    if (!usage.canDelete) {
      return undefined;
    }
    return () =>
      runDeleteToolUsage({
        variables: { id: usage.id },
        optimisticResponse: {
          deleteToolUsage: {
            __typename: 'DeleteToolUsageOutput',
          },
        },
        update: (cache) => {
          cache.modify({
            id: cache.identify(container),
            fields: {
              tools: (existing, { readField }) => ({
                ...existing,
                items: existing.items.filter(
                  (tool: Reference) => readField('id', tool) !== usage.id
                ),
              }),
            },
            optimistic: true,
          });
        },
      });
  };

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
              {
                message: 'Required',
                extensions: {
                  codes: ['Input'],
                  field: 'tool',
                },
              },
            ],
          });
        }

        void createToolUsage({
          variables: {
            input: {
              ...values,
              container: container.id,
              tool: values.tool.id,
            },
          },
        });
        setTimeout(() => {
          form.restart();
          form.focus('tool');
        }, 0);
      }}
      onClose={(reason, form) => {
        if (reason === 'success') return; // Keep the dialog open on success
        onClose?.(reason, form);
      }}
    >
      <Stack gap={2}>
        {container.tools.items.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }} role="list">
            {container.tools.items
              .toSorted(cmpBy((usage) => usage.tool.name.value))
              .map((usage) => (
                <Chip
                  key={usage.id}
                  role="listitem"
                  label={usage.tool.name.value}
                  color="default"
                  onDelete={deleteUsageFn(usage)}
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
