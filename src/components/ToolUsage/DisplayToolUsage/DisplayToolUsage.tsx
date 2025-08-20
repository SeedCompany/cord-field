import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { FormattedDate } from '../../Formatters';
import { DisplayToolUsageFragment } from './displayToolUsage.graphql';

interface Props {
  usage: DisplayToolUsageFragment;
}

export const DisplayToolUsage = ({ usage }: Props) => (
  <Tooltip
    key={usage.id}
    title={
      <Box>
        {usage.tool.aiBased.value && (
          <Typography variant="body2">AI-Based Tool</Typography>
        )}

        <Typography variant="body2">
          Started Using:{' '}
          {usage.startDate.value ? (
            <FormattedDate date={usage.startDate.value} />
          ) : (
            'Unknown'
          )}
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
);
