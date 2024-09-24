import { ChevronRight } from '@mui/icons-material';
import { Box, Divider, List, Typography } from '@mui/material';
import { Fragment } from 'react';
import { ProjectStepLabels, ProjectStepList } from '~/api/schema/enumLists';
import { RelativeDateTime } from '~/components/Formatters';
import { Link } from '~/components/Routing';
import { TextChip } from '~/components/TextChip';
import { ProjectWorkflowEventFragment as WorkflowEvent } from './projectWorkflowEvent.graphql';

export const WorkflowEventsList = ({
  events,
}: {
  events: readonly WorkflowEvent[];
}) => (
  <List
    sx={{
      display: 'grid',
      rowGap: 1,
      columnGap: 2,
      alignItems: 'center',
      gridTemplateColumns:
        '[at] min-content [from] min-content [arrow] min-content [to] min-content',
    }}
  >
    {events.toReversed().map((event, index, array) => {
      const prev = index >= 1 ? array[index - 1] : null;
      const prevStatus = prev ? prev.to : ProjectStepList[0]!;

      return (
        <Fragment key={event.id}>
          <Box sx={{ gridColumn: 'at' }}>
            {event.who.value?.__typename === 'User' && (
              <Link to={`/users/${event.who.value.id}`} color="inherit">
                {event.who.value.fullName}
              </Link>
            )}
            <Typography variant="subtitle2" color="text.secondary" noWrap>
              <RelativeDateTime date={event.at} />
            </Typography>
          </Box>
          <TextChip sx={{ gridColumn: 'from' }}>
            {ProjectStepLabels[prevStatus]}
          </TextChip>
          <ChevronRight
            sx={{ gridColumn: 'arrow', flexGrow: 0 }}
            aria-label="transitioned to"
          />
          <TextChip sx={{ gridColumn: 'to' }}>
            {ProjectStepLabels[event.to]}
          </TextChip>
          <Divider sx={{ gridColumn: '1/-1' }} />
        </Fragment>
      );
    })}
  </List>
);
