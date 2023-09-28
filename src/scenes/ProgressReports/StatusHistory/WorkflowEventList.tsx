import { ArrowForwardRounded as ArrowRightIcon } from '@mui/icons-material';
import { Box, Card, Divider, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';
import { ProgressReportStatusLabels as StatusLabels } from '~/api/schema/enumLists';
import { RelativeDateTime } from '~/components/Formatters';
import { RichTextView } from '~/components/RichText';
import { WorkflowEventFragment } from '../Detail/WorkflowEvent.graphql';

interface WorkFlowEventListProps {
  events?: readonly WorkflowEventFragment[];
  showNotes?: boolean;
}

export const WorkFlowEventList = ({
  showNotes,
  events,
}: WorkFlowEventListProps) => {
  if (!events) {
    return null;
  }

  const reversedEvents = [...events].reverse();

  return (
    <Stack
      component={Card}
      divider={<Divider sx={{ mx: -2, gridColumn: '1 / -1' }} />}
      sx={{
        overflow: 'initial',
        py: 1,
        px: 2,
        listStyle: 'none',
        display: 'grid',
        rowGap: 1,
        columnGap: 2,
        alignItems: 'center',
        gridTemplateColumns:
          '[from] min-content [arrow] min-content [to] min-content [at] auto',
        containerType: 'inline-size',
      }}
    >
      {reversedEvents.map((event: WorkflowEventFragment, i: number) => (
        <Fragment key={event.id}>
          <Typography variant="h4" gridColumn="from" whiteSpace="nowrap">
            {StatusLabels[reversedEvents[i + 1]?.status ?? 'NotStarted']}
          </Typography>
          <ArrowRightIcon
            fontSize="small"
            sx={{ gridColumn: 'arrow' }}
            aria-label="transitioned to"
          />
          <Typography variant="h4" gridColumn="to" whiteSpace="nowrap">
            {StatusLabels[event.status]}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              gridColumn: '1 / -1',
              '@container (min-width: 500px)': {
                gridColumn: 'at',
              },
            }}
          >
            {event.who.value?.fullName} <RelativeDateTime date={event.at} />
          </Typography>
          {showNotes && event.notes.value && (
            <Box
              sx={{
                gridColumn: '1 / -1',
                px: 2,
                '> *:last-child': { mb: 0 },
              }}
            >
              <RichTextView data={event.notes.value} />
            </Box>
          )}
        </Fragment>
      ))}
    </Stack>
  );
};
