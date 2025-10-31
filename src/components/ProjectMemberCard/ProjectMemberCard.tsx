import {
  Button,
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { RoleLabels } from '~/api/schema.graphql';
import { labelsFrom } from '~/common';
import { Avatar } from '../Avatar';
import { FormattedDate, FormattedDateTime } from '../Formatters';
import { Redacted } from '../Redacted';
import { Link } from '../Routing';
import { ProjectMemberCardFragment } from './ProjectMember.graphql';

export interface ProjectMemberCardProps {
  projectMember?: ProjectMemberCardFragment;
  // TODO this should use primary organization on User when api is finished
  primaryOrganizationName?: string;
  onEdit?: () => void;
  className?: string;
}

export const ProjectMemberCard = ({
  projectMember,
  primaryOrganizationName,
  onEdit,
  className,
}: ProjectMemberCardProps) => {
  return (
    <Card className={className}>
      <CardContent sx={{ display: 'flex' }}>
        <Avatar
          sx={(theme) => ({
            width: theme.spacing(7),
            height: theme.spacing(7),
            mr: 2,
          })}
          variant="circular"
          alt={projectMember?.user.value?.fullName ?? ''}
          loading={!projectMember}
        >
          {projectMember?.user.value?.avatarLetters}
        </Avatar>
        <div style={{ flexGrow: 1 }}>
          <UserRef projectMember={projectMember} />
          <Typography variant="body2" color="primary">
            {!projectMember ? (
              <Skeleton variant="text" width="33%" />
            ) : (
              primaryOrganizationName
            )}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {!projectMember ? (
              <Skeleton variant="text" width="25%" />
            ) : (
              labelsFrom(RoleLabels)(projectMember.roles.value)
            )}
          </Typography>
        </div>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          p: 1,
          pr: 2,
        }}
      >
        <Button disabled={!projectMember} color="primary" onClick={onEdit}>
          Edit
        </Button>
        <Typography variant="subtitle2" color="textSecondary">
          {!projectMember ? (
            <Skeleton variant="text" width="23ch" />
          ) : projectMember.active === false ? (
            projectMember.inactiveAt.value ? (
              <>
                Membership ended on{' '}
                <FormattedDate date={projectMember.inactiveAt.value} />
              </>
            ) : null
          ) : (
            <>
              Membership started at{' '}
              <FormattedDateTime date={projectMember.createdAt} />
            </>
          )}
        </Typography>
      </CardActions>
    </Card>
  );
};

const UserRef = ({
  projectMember,
}: Pick<ProjectMemberCardProps, 'projectMember'>) => {
  if (!projectMember) {
    return (
      <Typography>
        <Skeleton width="40%" />
      </Typography>
    );
  }
  if (!projectMember.user.value) {
    return <Redacted info="You cannot view this person" width="100%" />;
  }
  return (
    <Link
      color="inherit"
      to={`/users/${projectMember.user.value.id}`}
      underline="hover"
    >
      {projectMember.user.value.fullName}
    </Link>
  );
};
