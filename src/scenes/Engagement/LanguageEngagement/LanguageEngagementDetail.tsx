import { Add } from '@mui/icons-material';
import { Box, Card, Grid, Theme, Tooltip, Typography } from '@mui/material';
import { Fab } from '../../../components/Fab';
import { ResponsiveDivider } from '../../../components/ResponsiveDivider';
import { Link } from '../../../components/Routing';
import { ProductList } from '../../Products/List/ProductList';
import { EngagementQuery } from '../Engagement.graphql';
import { CeremonyForm } from './Ceremony';
import { DatesForm } from './DatesForm';
import { LanguageEngagementHeader } from './Header';
import { PlanningSpreadsheet, ProgressReports } from './ProgressAndPlanning';

const detailsSytle = (theme: Theme) => {
  return {
    // 900px is the min width that the periodic report and progress card look
    // good on the same row
    [theme.breakpoints.between(900, 'md')]: {
      // Grid=6 (half)
      flexGrow: 0,
      maxWidth: '50%',
      flexBasis: '50%',
    },
  };
};

const detailsCardStyle = {
  flex: 1,
  pt: 3,
  px: 2,
  pb: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'flex-end',
};

export const LanguageEngagementDetail = ({ engagement }: EngagementQuery) => {
  if (engagement.__typename !== 'LanguageEngagement') {
    return null; // easiest for typescript
  }

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
      <Grid
        component="main"
        container
        direction="column"
        spacing={3}
        sx={{ maxWidth: 'lg' }}
      >
        <LanguageEngagementHeader engagement={engagement} />
        <Grid item container spacing={5}>
          <Grid item lg={5} container direction="column" spacing={3}>
            <Grid item container spacing={3}>
              <Grid item container sx={detailsSytle}>
                <ProgressReports engagement={engagement} />
              </Grid>
              <Grid item container sx={detailsSytle}>
                <PlanningSpreadsheet engagement={engagement} />
              </Grid>
            </Grid>
            <Grid item container spacing={3}>
              <Grid item container sx={detailsSytle}>
                <Card sx={detailsCardStyle}>
                  <CeremonyForm ceremony={engagement.ceremony} />
                </Card>
              </Grid>
              <Grid item container sx={detailsSytle}>
                <Card sx={detailsCardStyle}>
                  <Typography variant="h4" gutterBottom>
                    Translation Details
                  </Typography>
                  <DatesForm engagement={engagement} />
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} lg="auto" container>
            <ResponsiveDivider vertical="lgUp" />
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            lg
            container
            direction="column"
            spacing={2}
          >
            <Grid item container spacing={2} alignItems="center">
              <Grid item component={Typography} variant="h3" paragraph>
                Goals
              </Grid>
              <Grid item>
                <Tooltip title="Create Goal">
                  <Fab
                    // @ts-expect-error it works. These generics are hard to express.
                    component={Link}
                    to="./products/create"
                    color="error"
                    size="small"
                  >
                    <Add />
                  </Fab>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid item container>
              <ProductList engagement={engagement} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
