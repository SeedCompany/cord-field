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
import { labelsFrom, StyleProps } from '~/common';
import { Avatar } from '../Avatar';
import { useDateTimeFormatter } from '../Formatters';
import { ProjectMemberCardFragment } from './ProjectMember.graphql';

export interface ProjectMemberCardProps extends StyleProps {
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
  sx,
}: ProjectMemberCardProps) => {
  const dateTimeFormatter = useDateTimeFormatter();

  const createdAtString = dateTimeFormatter(projectMember?.createdAt);

  return (
    <Card className={className} sx={sx}>
      <CardContent sx={{ display: 'flex' }}>
        <Avatar
          sx={(theme) => ({
            // theme.spacing(7) is 56px. if using 7 the css property is 7px
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
        <Box sx={{ flexGrow: 1 }}>
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
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          py: 1,
          pr: 2,
          pl: 1,
        }}
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
