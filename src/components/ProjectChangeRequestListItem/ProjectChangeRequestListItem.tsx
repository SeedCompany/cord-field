import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { ProjectChangeRequestTypeLabels } from '~/api/schema.graphql';
import { labelsFrom } from '~/common';
import { useProjectId } from '../../scenes/Projects/useProjectId';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { FormattedDateTime } from '../Formatters';
import { useNavigate } from '../Routing';
import { ProjectChangeRequestListItemFragment as ChangeRequest } from './ProjectChangeRequestListItem.graphql';

export interface ProjectChangeRequestListItemProps {
  data?: ChangeRequest;
  className?: string;
}

export const ProjectChangeRequestListItem = ({
  data,
  className,
}: ProjectChangeRequestListItemProps) => {
  const { projectId, changesetId: currentlyViewing } = useProjectId();
  const navigate = useNavigate();

  return (
    <Card className={className}>
      <CardContent>
        <Typography
          variant="body1"
          sx={{
            ...(data && { display: 'flex' }),
          }}
        >
          <Typography
            component="span"
            variant="inherit"
            color="primary"
            display="inline"
            style={data ? undefined : { width: '10%' }}
          >
            {!data ? <Skeleton width="100%" /> : data.status.value}
          </Typography>
          <Box sx={{ color: 'text.secondary', mx: 1 }}>—</Box>
          <Typography
            component="span"
            variant="inherit"
            display="inline"
            style={data ? undefined : { width: '40%' }}
          >
            {!data ? (
              <Skeleton width="100%" />
            ) : (
              labelsFrom(ProjectChangeRequestTypeLabels)(data.types.value)
            )}
          </Typography>
        </Typography>
        <DisplaySimpleProperty
          label="ID"
          value={data?.id}
          loading={!data}
          loadingWidth="25%"
          paragraph
        />
        <Typography>
          {!data ? <Skeleton width="40%" /> : data.summary.value}
        </Typography>
      </CardContent>
      <CardActions
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'space-between',
          padding: theme.spacing(1, 2, 1, 1),
        })}
      >
        {!data || data.canEdit ? (
          <Button
            disabled={!data || currentlyViewing === data.id}
            color="primary"
            onClick={() =>
              data?.id && navigate(`../../${projectId}~${data.id}`)
            }
          >
            {currentlyViewing === data?.id ? 'Viewing' : 'View'}
          </Button>
        ) : null}
        <Tooltip title={data ? 'Not implemented yet' : ''}>
          <Button disabled={!data} color="primary">
            Review
          </Button>
        </Tooltip>
        <div style={{ flexGrow: 1 }} />
        <Typography variant="subtitle2" color="textSecondary">
          {!data ? (
            <Skeleton width="23ch" />
          ) : (
            <>
              Created at <FormattedDateTime date={data.createdAt} />
            </>
          )}
        </Typography>
      </CardActions>
    </Card>
  );
};
