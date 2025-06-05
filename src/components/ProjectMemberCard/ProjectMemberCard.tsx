import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Skeleton,
  Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { RoleLabels } from '~/api/schema.graphql';
import { labelsFrom } from '~/common';
import { Avatar } from '../Avatar';
import { FormattedDate, FormattedDateTime } from '../Formatters';
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
          {!projectMember ? (
            <Skeleton variant="text" width="25%" />
          ) : (
            !projectMember.active &&
            projectMember.inactiveAt.canRead && (
              <Box display="flex" alignItems="center" mt={1}>
                <Chip
                  label="Inactive"
                  sx={{
                    bgcolor: 'info.main',
                    color: 'info.contrastText',
                  }}
                />
                <Typography variant="caption" color="textSecondary" ml={1}>
                  Since&nbsp;
                  <FormattedDate date={projectMember.inactiveAt.value} />
                </Typography>
              </Box>
            )
          )}
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
