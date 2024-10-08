import { ChevronRight } from '@mui/icons-material';
import { Box, Divider, List, ListProps, Typography } from '@mui/material';
import { forwardRef } from 'react';
import { ProjectStepLabels, ProjectStepList } from '~/api/schema/enumLists';
import { extendSx } from '~/common';
import { RelativeDateTime } from '~/components/Formatters';
import { Link } from '~/components/Routing';
import { TextChip } from '~/components/TextChip';
import { ProjectWorkflowEventFragment as WorkflowEvent } from './projectWorkflowEvent.graphql';

type WorkflowEventsListProps = {
  events: readonly WorkflowEvent[];
  fullWidth?: boolean;
} & ListProps;

export const WorkflowEventsList = forwardRef<any, WorkflowEventsListProps>(
  function WorkflowEventsList({ events, fullWidth = false, ...props }, ref) {
    const list = events
      .map((event, i) => ({
        ...event,
        from: events[i - 1]?.to ?? ProjectStepList[0]!,
      }))
      .reverse();

    return (
      <List
        {...props}
        ref={ref}
        sx={[
          {
            display: 'flex',
            flexDirection: 'column',
          },
          !fullWidth && {
            display: 'grid',
            rowGap: 1,
            columnGap: 2,
            alignItems: 'center',
            gridTemplateColumns:
              '[at] min-content [from] minmax(min-content, 1fr) [arrow] min-content [to] minmax(min-content, 1fr)',
          },
          ...extendSx(props.sx),
        ]}
      >
        {list.map((event) => (
          <Box
            key={event.id}
            sx={[
              {
                display: 'contents',
              },
              fullWidth &&
                ((theme) => ({
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1,
                  padding: 1,
                  borderBottom: `thin solid ${theme.palette.divider}`,
                })),
            ]}
          >
            <Box
              sx={{
                gridColumn: 'at',
                // add a bit more row padding between the two
                mr: fullWidth ? 1 : 0,
              }}
            >
              {event.who.value?.__typename === 'User' && (
                <Link to={`/users/${event.who.value.id}`} color="inherit">
                  {event.who.value.fullName}
                </Link>
              )}
              <Typography variant="subtitle2" color="text.secondary" noWrap>
                <RelativeDateTime date={event.at} />
              </Typography>
            </Box>
            <Box
              sx={[
                { display: 'contents' },
                fullWidth && {
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 1,
                },
              ]}
            >
              <TextChip sx={{ gridColumn: 'from' }}>
                {ProjectStepLabels[event.from]}
              </TextChip>
              <ChevronRight
                sx={{ gridColumn: 'arrow', flexGrow: 0 }}
                aria-label="transitioned to"
              />
              <TextChip sx={{ gridColumn: 'to' }}>
                {ProjectStepLabels[event.to]}
              </TextChip>
            </Box>
            <Divider
              sx={{
                gridColumn: '1/-1',
                display: fullWidth ? 'none' : undefined,
              }}
            />
          </Box>
        ))}
      </List>
    );
  }
);
