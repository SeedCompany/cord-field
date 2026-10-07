import { Typography } from '@mui/material';
import { ProjectStepLabels } from '~/api/schema.graphql';
import { Link } from '~/components/Routing';
import { BaseView, Views } from './Base';

export const ProjectTransitionViaMembership: Views['ProjectTransitionViaMembership'] =
  ({ notification }) => {
    const { workflowEvent: event } = notification;
    const { project } = event;
    return (
      <BaseView notification={notification}>
        <Typography color="text.primary">
          <Link to={`/projects/${project.id}`}>{project.name.value}</Link>{' '}
          transitioned to{' '}
          <strong>{ProjectStepLabels[notification.workflowEvent.to]}</strong>
        </Typography>
      </BaseView>
    );
  };
