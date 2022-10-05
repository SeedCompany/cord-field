import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { PartialDeep } from 'type-fest';
import { ProjectStatusLabels } from '~/api/schema.graphql';
import { ProjectListQueryVariables } from '../../scenes/Projects/List/projects.graphql';
import { getProjectUrl } from '../../scenes/Projects/useProjectId';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { FormattedDate } from '../Formatters';
import { PresetInventoryIconFilled } from '../Icons';
import { CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';
import { TogglePinButton } from '../TogglePinButton';
import { ProjectListItemFragment } from './ProjectListItem.graphql';

const skeletonRight = {
  marginLeft: 'auto',
};

export interface ProjectListItemCardProps {
  project?: ProjectListItemFragment;
  className?: string;
}

export const ProjectListItemCard = ({
  project,
  className,
}: ProjectListItemCardProps) => {
  const location = project?.primaryLocation.value?.name.value;

  return (
    <Card
      className={className}
      sx={(theme) => ({
        width: '100%',
        maxWidth: theme.breakpoints.values.sm,
        position: 'relative',
      })}
    >
      <CardActionAreaLink
        disabled={!project}
        to={project ? getProjectUrl(project) : ''}
        sx={{
          display: 'flex',
          alignItems: 'initial',
        }}
      >
        <CardContent
          sx={(theme) => ({
            flex: 1,
            padding: theme.spacing(2, 3),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          })}
        >
          <Grid
            container
            direction="column"
            justifyContent="space-between"
            spacing={1}
            sx={{
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Grid item>
              <Typography variant="h4">
                {!project ? <Skeleton variant="text" /> : project.name.value}
                {project?.presetInventory.value && (
                  <PresetInventoryIconFilled
                    color="action"
                    sx={(theme) => ({
                      verticalAlign: 'bottom',
                      marginLeft: theme.spacing(1),
                    })}
                    aria-label="preset inventory"
                  />
                )}
              </Typography>
            </Grid>
            <DisplaySimpleProperty
              loading={!project}
              label="Project ID"
              value={project?.id}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
            <DisplaySimpleProperty
              loading={!project}
              label="Department ID"
              value={project?.departmentId.value}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
            <Grid item>
              <Typography variant="body2" color="primary">
                {!project ? (
                  <Skeleton variant="text" />
                ) : location ? (
                  location
                ) : (
                  <>&nbsp;</>
                )}
              </Typography>
            </Grid>
            <Grid item>
              <Sensitivity
                value={project?.sensitivity}
                loading={!project}
                sx={(theme) => ({
                  marginBottom: theme.spacing(1),
                })}
              />
            </Grid>
            <Grid item>
              {!project ? (
                <Skeleton variant="text" width="50%" />
              ) : (
                <DisplaySimpleProperty
                  label="Status"
                  value={ProjectStatusLabels[project.projectStatus]}
                />
              )}
            </Grid>
          </Grid>
          <Box
            sx={(theme) => ({
              flex: 1,
              textAlign: 'right',
              marginLeft: theme.spacing(2),
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            })}
          >
            <DisplaySimpleProperty aria-hidden="true" />
            <Box
              sx={{
                flex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h1">
                {!project ? (
                  <Skeleton variant="text" width="1ch" sx={skeletonRight} />
                ) : (
                  project.engagements.total
                )}
              </Typography>
              <Typography variant="body2" color="primary">
                {!project ? (
                  <>
                    <Skeleton variant="text" width="9ch" sx={skeletonRight} />
                    <Skeleton variant="text" width="11ch" sx={skeletonRight} />
                  </>
                ) : (
                  <>
                    {project.type === 'Internship' ? 'Internship' : 'Language'}
                    <br />
                    Engagements
                  </>
                )}
              </Typography>
            </Box>
            {!project ? (
              <Skeleton variant="text" />
            ) : (
              <DisplaySimpleProperty
                label="ESAD"
                value={
                  project.estimatedSubmission.value ? (
                    <FormattedDate date={project.estimatedSubmission.value} />
                  ) : undefined
                }
                ValueProps={{ color: 'primary' }}
              />
            )}
          </Box>
        </CardContent>
      </CardActionAreaLink>
      <TogglePinButton
        object={project}
        label="Project"
        listId="projects"
        listFilter={(args: PartialDeep<ProjectListQueryVariables>) =>
          args.input?.filter?.pinned ?? false
        }
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}
      />
    </Card>
  );
};
