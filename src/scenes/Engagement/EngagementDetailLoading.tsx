import { Edit } from '@mui/icons-material';
import { Box, Breadcrumbs, Grid, Skeleton, Typography } from '@mui/material';
import { Breadcrumb } from '../../components/Breadcrumb';
import { DataButton } from '../../components/DataButton';
import { Fab } from '../../components/Fab';
import { FieldOverviewCard } from '../../components/FieldOverviewCard';
import { ProjectBreadcrumb } from '../../components/ProjectBreadcrumb';
import { CeremonyCard } from './CeremonyCard';

export const EngagementDetailLoading = () => {
  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        overflowY: 'auto',
        padding: theme.spacing(4),
      })}
    >
      <Grid
        component="main"
        container
        direction="column"
        spacing={3}
        sx={(theme) => ({
          maxWidth: theme.breakpoints.values.md,
        })}
      >
        <Grid item>
          <Breadcrumbs>
            <ProjectBreadcrumb />
            <Breadcrumb to=".">
              <Skeleton width={200} />
            </Breadcrumb>
          </Breadcrumbs>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item style={{ width: '50%' }}>
            <Typography variant="h2">
              <Skeleton width="100%" />
            </Typography>
          </Grid>
          <Grid item>
            <Fab loading>
              <Edit />
            </Fab>
          </Grid>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item>
            <Typography variant="h4">
              <Skeleton width={200} />
            </Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <DataButton loading={true} children={null} />
          </Grid>
          <Grid item>
            <DataButton loading={true} children={null} />
          </Grid>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <FieldOverviewCard />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard />
          </Grid>
        </Grid>
        <Grid item container spacing={3} alignItems="center">
          <Grid item xs={6}>
            <CeremonyCard />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
