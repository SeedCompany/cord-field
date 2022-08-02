import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { RoleLabels } from '~/api/schema.graphql';
import { labelsFrom } from '~/common';
import { Avatar } from '../Avatar';
import { useDateTimeFormatter } from '../Formatters';
import { ProjectMemberCardFragment } from './ProjectMember.graphql';

const useStyles = makeStyles(({ spacing }) => ({
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
  const classes = useStyles();
  const dateTimeFormatter = useDateTimeFormatter();

  const createdAtString = dateTimeFormatter(projectMember?.createdAt);

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
          <Typography>
            {!projectMember ? (
              <Skeleton variant="text" width="40%" />
            ) : (
              projectMember.user.value?.fullName
            )}
          </Typography>
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
            `Member Since ${createdAtString}`
          )}
        </Typography>
      </CardActions>
    </Card>
  );
};
