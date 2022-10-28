import {
  Box,
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
import { useDateTimeFormatter } from '../Formatters';
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
  const dateTimeFormatter = useDateTimeFormatter();

  const createdAtString = dateTimeFormatter(projectMember?.createdAt);

  return (
    <Card className={className}>
      <CardContent
        sx={{
          display: 'flex',
        }}
      >
        <Avatar
          sx={(theme) => ({
            width: theme.spacing(7),
            height: theme.spacing(7),
            marginRight: theme.spacing(2),
          })}
          variant="circular"
          alt={projectMember?.user.value?.fullName ?? ''}
          loading={!projectMember}
        >
          {projectMember?.user.value?.avatarLetters}
        </Avatar>
        <Box
          sx={{
            flexGrow: 1,
          }}
        >
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
        </Box>
      </CardContent>
      <CardActions
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'space-between',
          padding: theme.spacing(1, 2, 1, 1),
        })}
      >
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
