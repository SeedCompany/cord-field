import { Add } from '@mui/icons-material';
import { Card, Grid, Tooltip, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Fab } from '../../../components/Fab';
import { ProgressReportsOverviewCard } from '../../../components/ProgressReportsOverviewCard/ProgressReportsOverviewCard';
import { ResponsiveDivider } from '../../../components/ResponsiveDivider';
import { Link } from '../../../components/Routing';
import { ProductList } from '../../Products/List/ProductList';
import { EngagementQuery } from '../Engagement.graphql';
import { CeremonyForm } from './Ceremony';
import { DatesForm } from './DatesForm';
import { LanguageEngagementDescription } from './Description';
import { LanguageEngagementHeader } from './Header';
import { PlanningSpreadsheet } from './PlanningSpreadsheet';

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.lg,
  },
  details: {
    // 900px is the min width that the periodic report and progress card look
    // good on the same row
    [breakpoints.between(900, 'md')]: {
      // Grid=6 (half)
      flexGrow: 0,
      maxWidth: '50%',
      flexBasis: '50%',
    },
  },
  detailsCard: {
    flex: 1,
    padding: spacing(3, 2, 1),
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-end',
  },
}));

export const LanguageEngagementDetail = ({ engagement }: EngagementQuery) => {
  const { classes } = useStyles();

  if (engagement.__typename !== 'LanguageEngagement') {
    return null; // easiest for typescript
  }

  return (
    <div className={classes.root}>
      <Grid
        component="main"
        container
        direction="column"
        spacing={3}
        className={classes.main}
      >
        <LanguageEngagementHeader engagement={engagement} />
        <Grid item container spacing={5}>
          <Grid item lg={5} container direction="column" spacing={3}>
            <Grid item container spacing={3}>
              <Grid item container className={classes.details}>
                <ProgressReportsOverviewCard
                  dueCurrently={engagement.currentProgressReportDue}
                  dueNext={engagement.nextProgressReportDue}
                />
              </Grid>
              <Grid item container className={classes.details}>
                <PlanningSpreadsheet engagement={engagement} />
              </Grid>
            </Grid>
            <Grid item container spacing={3}>
              <Grid item container className={classes.details}>
                <Card className={classes.detailsCard}>
                  <CeremonyForm ceremony={engagement.ceremony} />
                </Card>
              </Grid>
              <Grid item container className={classes.details}>
                <Card className={classes.detailsCard}>
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
            <Grid item>
              <LanguageEngagementDescription engagement={engagement} />
            </Grid>
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
    </div>
  );
};
