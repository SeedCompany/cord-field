import { Card, CardActions, CardProps, Typography } from '@mui/material';
import { RelativeDateTime } from '~/components/Formatters';
import { ButtonLink } from '~/components/Routing';
import { ProgressReportDetailFragment } from './ProgressReportDetail.graphql';
import { StatusStepper } from './StatusStepper';

type WorkflowCardProps = {
  report?: ProgressReportDetailFragment;
} & CardProps;

export const WorkflowCard = ({ report, ...rest }: WorkflowCardProps) => {
  const lastWorkflowEvent = report?.workflowEvents.at(
    report.workflowEvents.length - 1
  );
  return (
    <Card {...rest}>
      <Typography variant="h3" sx={{ pl: 2, pt: 2 }}>
        Status
      </Typography>
      <StatusStepper loading={!report} current={report?.status.value} />
      {lastWorkflowEvent && (
        <CardActions
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ButtonLink
            to="workflow-history"
            sx={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}
          >
            View History
          </ButtonLink>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              pr: 1,
              pl: { sm: 5 },
              display: { xs: 'flex', sm: 'block' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Updated by{' '}
            {actorName(lastWorkflowEvent.who.value)}{' '}
            <RelativeDateTime date={lastWorkflowEvent.at} />
          </Typography>
        </CardActions>
      )}
    </Card>
  );
};

/**
 * A workflow event can be executed by a SystemAgent as well as a person, and
 * only the User arm carries a name.
 */
const actorName = (
  actor?: { __typename?: string; fullName?: string | null } | null,
) =>
  actor?.__typename === 'User' ? actor.fullName : 'an automated process';
