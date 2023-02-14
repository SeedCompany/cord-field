import { ArrowForwardRounded as ArrowRightIcon } from '@mui/icons-material';
import { Box, Card, Collapse, Divider, Stack, Typography } from '@mui/material';
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

  return (
    <Card sx={{ p: 4, overflowY: 'auto' }}>
      <Stack
        component="ul"
        divider={<Divider />}
        spacing={1}
        sx={{ listStyle: 'none' }}
      >
        {events.map((event: WorkflowEventFragment, i: number) => {
          return (
            <li key={i}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {StatusLabels[events[i - 1]?.status ?? 'NotStarted']}
                  <ArrowRightIcon sx={{ mx: 1 }} aria-label="transitioned to" />
                  {StatusLabels[event.status]}
                </Typography>
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {event.who.value?.fullName}{' '}
                  <RelativeDateTime date={event.at} />
                </Typography>
              </Box>
              <Collapse in={showNotes}>
                {event.notes.value && (
                  <Box sx={{ px: 3, pt: 1 }}>
                    <RichTextView data={event.notes.value} />
                  </Box>
                )}
              </Collapse>
            </li>
          );
        })}
      </Stack>
    </Card>
  );
};
