import { Edit } from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import { useDialog } from '../../Dialog';
import { IconButton } from '../../IconButton';
import { DisplayToolUsage } from '../DisplayToolUsage/DisplayToolUsage';
import { ManageToolUsage } from '../ManageToolUsage';
import { ToolsUsedListFragment } from './toolsUsedList.graphql';

interface Props {
  resource: ToolsUsedListFragment;
}

export const ToolsUsedList = ({ resource }: Props) => {
  const [manageToolsState, openManageTools] = useDialog();

  const tools = resource.tools.items;

  return (
    <Box>
      <Box
        sx={{
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="h3">Tools</Typography>
        <Tooltip title="Manage Tools">
          <IconButton onClick={openManageTools}>
            <Edit />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          minHeight: 40,
          alignItems: 'flex-start',
        }}
      >
        {tools.length === 0 ? (
          <Typography color="textSecondary">No tools used yet</Typography>
        ) : (
          tools.map((usage) => (
            <DisplayToolUsage key={usage.id} usage={usage} />
          ))
        )}
      </Box>

      <ManageToolUsage
        container={resource}
        existingTools={tools}
        {...manageToolsState}
      />
    </Box>
  );
};
