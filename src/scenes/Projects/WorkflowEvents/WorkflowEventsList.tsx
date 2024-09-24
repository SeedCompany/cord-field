import { ChevronRight } from '@mui/icons-material';
import { Box, Divider, List, Typography } from '@mui/material';
import { ProjectStepLabels, ProjectStepList } from '~/api/schema/enumLists';
import { RelativeDateTime } from '~/components/Formatters';
import { Link } from '~/components/Routing';
import { TextChip } from '~/components/TextChip';
import { ProjectWorkflowEventFragment as WorkflowEvent } from './projectWorkflowEvent.graphql';

const gridAt = 'md' as const;

export const WorkflowEventsList = ({
  events,
}: {
  events: readonly WorkflowEvent[];
}) => (
  <List
    sx={(theme) => ({
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.up(gridAt)]: {
        display: 'grid',
        rowGap: 1,
        columnGap: 2,
        alignItems: 'center',
        gridTemplateColumns:
          '[at] min-content [from] min-content [arrow] min-content [to] min-content',
      },
    })}
  >
    {events.toReversed().map((event, index, array) => {
      const prev = index >= 1 ? array[index - 1] : null;
      const prevStatus = prev ? prev.to : ProjectStepList[0]!;

      return (
        <Box
          key={event.id}
          sx={(theme) => ({
            display: 'contents',
            [theme.breakpoints.down(gridAt)]: {
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 1,
              padding: 1,
              borderBottom: `thin solid ${theme.palette.divider}`,
            },
          })}
        >
          <Box
            sx={{
              gridColumn: 'at',
              // add a bit more row padding between the two
              mr: { xs: 1, [gridAt]: 0 },
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
            sx={(theme) => ({
              display: 'contents',
              [theme.breakpoints.down(gridAt)]: {
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 1,
              },
            })}
          >
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
          </Box>
          <Divider
            sx={{
              gridColumn: '1/-1',
              display: { xs: 'none', [gridAt]: 'unset' },
            }}
          />
        </Box>
      );
    })}
  </List>
);
