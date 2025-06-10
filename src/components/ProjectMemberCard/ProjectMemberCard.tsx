import {
  Button,
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { RoleLabels } from '~/api/schema.graphql';
import { labelsFrom } from '~/common';
import { Avatar } from '../Avatar';
import { FormattedDateTime } from '../Formatters';
import { Redacted } from '../Redacted';
import { Link } from '../Routing';
import { ProjectMemberCardFragment } from './ProjectMember.graphql';

const useStyles = makeStyles()(({ spacing }) => ({
  cardContent: {
    display: 'flex',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: spacing(1, 2, 1, 1),
  },
  avatar: {
    width: spacing(7),
    height: spacing(7),
    marginRight: spacing(2),
  },
  memberInfo: {
    flexGrow: 1,
  },
}));

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
  const { classes } = useStyles();

  return (
    <Card className={className}>
      <CardContent className={classes.cardContent}>
        <Avatar
          className={classes.avatar}
          variant="circular"
          alt={projectMember?.user.value?.fullName ?? ''}
          loading={!projectMember}
        >
          {projectMember?.user.value?.avatarLetters}
        </Avatar>
        <div className={classes.memberInfo}>
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
      <CardActions className={classes.cardActions}>
        <Button disabled={!projectMember} color="primary" onClick={onEdit}>
          Edit
        </Button>
        <Typography variant="subtitle2" color="textSecondary">
          {!projectMember ? (
            <Skeleton variant="text" width="23ch" />
          ) : (
            <>
              Member Since <FormattedDateTime date={projectMember.createdAt} />
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
