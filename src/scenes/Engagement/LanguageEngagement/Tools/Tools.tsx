import { Edit } from '@mui/icons-material';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { Fab } from '~/components/Fab';
import { FormattedDate } from '~/components/Formatters';
import { ManageToolUsage } from '~/components/ToolUsage';
import { useDialog } from '../../../../components/Dialog';
import { EngagementToolUsageFragment } from './Tools.graphql';

interface Props {
  engagement: EngagementToolUsageFragment;
}

export const Tools = ({ engagement }: Props) => {
  const [manageToolsState, openManageTools] = useDialog();

  const tools = engagement.tools;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="h3" sx={{ mr: 2 }}>
          Tools
        </Typography>
        <Tooltip title="Manage Tools">
          <Fab color="primary" size="small" onClick={openManageTools}>
            <Edit />
          </Fab>
        </Tooltip>
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Tools being used in this language engagement
      </Typography>

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
          <Typography color="textSecondary" variant="body2">
            No tools have been added to this engagement yet.
          </Typography>
        ) : (
          tools.map((usage) => (
            <Tooltip
              key={usage.id}
              title={
                <Box>
                  {usage.tool.aiBased.value && (
                    <Typography variant="body2">AI-Based Tool</Typography>
                  )}

                  <Typography variant="body2">
                    Started: <FormattedDate date={usage.startDate.value} />
                  </Typography>
                </Box>
              }
            >
              <Chip
                label={usage.tool.name.value}
                color="default"
                sx={{
                  cursor: 'default',
                  color: 'text.primary',
                }}
              />
            </Tooltip>
          ))
        )}
      </Box>

      <ManageToolUsage
        container={engagement}
        existingTools={tools}
        {...manageToolsState}
      />
    </Box>
  );
};
