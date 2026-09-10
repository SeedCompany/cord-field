import { Typography } from '@mui/material';
import { Link } from '~/components/Routing';
import { BaseView, Views } from './Base';

export const ProjectTransitionRequiringFinancialApproval: Views['ProjectTransitionRequiringFinancialApproval'] =
  ({ notification }) => {
    const { workflowEvent: event } = notification;
    const { project } = event;
    return (
      <BaseView notification={notification}>
        <Typography color="text.primary">
          <Link to={`/projects/${project.id}`}>{project.name.value}</Link>{' '}
          requires financial approval
        </Typography>
      </BaseView>
    );
  };
