import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { PartialDeep } from 'type-fest';
import { ProjectStatusLabels, ProjectTypeLabels } from '~/api/schema.graphql';
import { extendSx, labelFrom, StyleProps } from '~/common';
import { ProjectListQueryVariables } from '../../scenes/Projects/List/ProjectList.graphql';
import { getProjectUrl } from '../../scenes/Projects/useProjectId';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { FormattedDate } from '../Formatters';
import { CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';
import { TogglePinButton } from '../TogglePinButton';
import { ProjectListItemFragment } from './ProjectListItem.graphql';

export interface ProjectListItemCardProps {
  project?: ProjectListItemFragment;
}

export const ProjectListItemCard = ({
  project,
  sx,
}: ProjectListItemCardProps & StyleProps) => {
  const location = project?.primaryLocation.value?.name.value;

  return (
    <Card
      sx={[
        (theme) => ({
          width: '100%',
          maxWidth: theme.breakpoints.values.sm,
          position: 'relative',
        }),
        ...extendSx(sx),
      ]}
    >
      <CardActionAreaLink
        disabled={!project}
        to={project ? getProjectUrl(project) : ''}
        sx={{ display: 'flex', alignItems: 'initial' }}
      >
        <CardContent
          sx={(theme) => ({
            flex: 1,
            p: theme.spacing(2, 3),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          })}
        >
          <Grid
            container
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
              <Stack direction="row" spacing={2} alignItems="center">
                <Sensitivity
                  value={project?.sensitivity}
                  loading={!project}
                  sx={{
                    mb: 1,
                  }}
                />
                <Chip
                  label={labelFrom(ProjectTypeLabels)(project?.type)}
                  variant="outlined"
                />
              </Stack>
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
            sx={{
              flex: 1,
              textAlign: 'right',
              ml: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <DisplaySimpleProperty aria-hidden="true" />
            <Box
              style={{
                flex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h1">
                {!project ? (
                  <Skeleton
                    variant="text"
                    sx={{ marginLeft: 'auto', width: '1ch' }}
                  />
                ) : (
                  project.engagements.total
                )}
              </Typography>
              <Typography variant="body2" color="primary">
                {!project ? (
                  <>
                    <Skeleton
                      variant="text"
                      sx={{ marginLeft: 'auto', width: '9ch' }}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ marginLeft: 'auto', width: '11ch' }}
                    />
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
