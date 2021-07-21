import { Card, Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { FC } from 'react';
import { Fab } from '../../../components/Fab';
import { ResponsiveDivider } from '../../../components/ResponsiveDivider';
import { Link } from '../../../components/Routing';
import { ProductList } from '../../Products/List/ProductList';
import { EngagementQuery } from '../Engagement.generated';
import { CeremonyForm } from './Ceremony';
import { DatesForm } from './DatesForm';
import { LanguageEngagementHeader } from './Header';
import { PlanningSpreadsheet, ProgressReports } from './ProgressAndPlanning';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
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

export const LanguageEngagementDetail: FC<EngagementQuery> = ({
  project,
  engagement,
}) => {
  const classes = useStyles();

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
        <LanguageEngagementHeader engagement={engagement} project={project} />
        <Grid item container spacing={5}>
          <Grid item lg={5} container direction="column" spacing={3}>
            <Grid item container spacing={3}>
              <Grid item container className={classes.details}>
                <ProgressReports engagement={engagement} />
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
          <ResponsiveDivider vertical="lgUp" spacing={3} />
          <Grid item xs md lg container direction="column" spacing={2}>
            <Grid item container spacing={2} alignItems="center">
              <Grid item component={Typography} variant="h3" paragraph>
                Products
              </Grid>
              <Grid item>
                <Tooltip title="Create Product">
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
