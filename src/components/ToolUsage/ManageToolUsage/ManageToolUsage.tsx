import { Box, Chip } from '@mui/material';
import { noop } from 'lodash';
import { useMemo, useState } from 'react';
import { Except } from 'type-fest';
import { Entity } from '~/api';
import {
  CreateToolUsage,
  CreateToolUsageProps,
} from '../CreateToolUsage/CreateToolUsage';
import { DeleteToolUsage } from '../DeleteToolUsage/DeleteToolUsage';
import { ToolUsageFormFragment } from '../ToolUsageForm/ToolUsageForm.graphql';

export type ManageToolUsageProps = Except<CreateToolUsageProps, 'container'> & {
  container: Entity;
  existingTools?: readonly ToolUsageFormFragment[];
};

export const ManageToolUsage = ({
  container,
  existingTools = [],
  onClose,
  onSuccess,
  ...dialogProps
}: ManageToolUsageProps) => {
  // helping to clear date after successful submission, due to memo from DateField
  const [dateFieldKey, setDateFieldKey] = useState(0);

  const usedToolIds = useMemo(
    () =>
      new Set(
        existingTools.map((usage: ToolUsageFormFragment) => usage.tool.id)
      ),
    [existingTools]
  );

  return (
    <CreateToolUsage
      container={container}
      title="Manage Tools"
      submitLabel="Add Tool"
      dateFieldKey={dateFieldKey}
      getOptionDisabled={(tool) => usedToolIds.has(tool.id)}
      onClose={(reason, form) => {
        if (reason === 'success') return; // Keep dialog open on success
        onClose?.(reason, form);
      }}
      onSuccess={(result, form) => {
        // Clear the form fields and keep dialog open
        form.change('toolUsage', {
          startDate: undefined,
          toolLookupItem: null as any,
        });
        setDateFieldKey((prev) => prev + 1);
        onSuccess?.(result, form);
      }}
      {...dialogProps}
    >
      {existingTools.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {existingTools.map((usage: ToolUsageFormFragment) => (
              <Chip
                key={usage.id}
                label={usage.tool.name.value}
                color="default"
                deleteIcon={<DeleteToolUsage toolUsage={usage} size="small" />}
                onDelete={noop} // Required for deleteIcon to be interactive
                sx={{
                  '& .MuiChip-deleteIcon': { color: 'action.active' },
                  '& .MuiChip-label': { color: 'text.primary' },
                  '&:hover': {
                    backgroundColor: 'error.main',
                    borderColor: 'error.main',
                    '& .MuiChip-label': { color: 'error.contrastText' },
                    '& .MuiChip-deleteIcon': { color: 'error.contrastText' },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </CreateToolUsage>
  );
};
