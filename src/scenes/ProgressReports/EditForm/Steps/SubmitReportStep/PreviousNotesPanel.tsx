import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useToggle } from 'ahooks';
import { ProgressReportStatusLabels as StatusLabels } from '~/api/schema/enumLists';
import { RelativeDateTime } from '~/components/Formatters';
import { isDataEmpty, RichTextView } from '~/components/RichText';
import { WorkflowEventFragment } from '../../../Detail/WorkflowEvent.graphql';

interface PreviousNotesPanelProps {
  events?: readonly WorkflowEventFragment[];
}

export const PreviousNotesPanel = ({ events }: PreviousNotesPanelProps) => {
  const [expanded, { toggle }] = useToggle(false);

  const notedEvents = (events ?? [])
    .filter((event) => !isDataEmpty(event.notes.value))
    .slice()
    .reverse();

  if (notedEvents.length === 0) {
    return null;
  }

  return (
    <Accordion expanded={expanded} square sx={{ mb: 2 }}>
      <AccordionSummary
        aria-controls="previous-notes-content"
        expandIcon={<ExpandMore />}
        onClick={toggle}
      >
        Previous Notes ({notedEvents.length})
      </AccordionSummary>
      <AccordionDetails>
        <Stack divider={<Divider />} spacing={1.5}>
          {notedEvents.map((event) => (
            <Stack key={event.id} spacing={0.5}>
              <Typography variant="subtitle2">
                {StatusLabels[event.status]}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {event.who.value?.fullName} <RelativeDateTime date={event.at} />
              </Typography>
              <RichTextView data={event.notes.value} />
            </Stack>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
