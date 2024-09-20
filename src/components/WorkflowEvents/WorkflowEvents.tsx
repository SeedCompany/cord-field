import { ChevronRight } from '@mui/icons-material';
import { Box, Divider, List, Typography } from '@mui/material';
import { Fragment } from 'react';
import { ProjectStepLabels, ProjectStepList } from '~/api/schema/enumLists';
import { ProjectWorkflowEventFragment as WorkflowEvent } from '../../scenes/Projects/StatusHistory/WorkflowEvent.graphql';
import { FormattedDateTime } from '../Formatters';
import { Link } from '../Routing';
import { TextChip } from '../TextChip';

export const WorkflowEvents = ({
  events,
}: {
  events: readonly WorkflowEvent[];
}) => {
  return (
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
      {events.map((event: WorkflowEvent, index, array) => {
        const prev = index >= 1 ? array[index - 1] : null;
        const prevStatus = prev ? prev.to : ProjectStepList[0]!;

        return (
          <Fragment key={event.id}>
            <Box sx={{ gridColumn: 'at' }}>
              <Typography variant="body1">
                {event.who.value && event.who.value.__typename === 'User' && (
                  <Link to={`/users/${event.who.value.id}`} color="inherit">
                    {event.who.value.fullName}
                  </Link>
                )}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" noWrap>
                <FormattedDateTime date={event.at} />
              </Typography>
            </Box>
            <TextChip sx={{ gridColumn: 'from', color: 'text.secondary' }}>
              {ProjectStepLabels[prevStatus]}
            </TextChip>
            <ChevronRight
              sx={{ gridColumn: 'arrow', flexGrow: 0 }}
              aria-label="transitioned to"
            />
            <TextChip sx={{ gridColumn: 'to', color: 'text.secondary' }}>
              {ProjectStepLabels[event.to]}
            </TextChip>
            <Divider sx={{ gridColumn: '1/-1' }} />
          </Fragment>
        );
      })}
    </List>
  );
};
