import {
  Card,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { FC } from 'react';
import { Fab } from '../../../components/Fab';
import { Link } from '../../../components/Routing';
import { ProductList } from '../../Products/List/ProductList';
import { EngagementQuery } from '../Engagement.generated';
import { CeremonyForm } from './Ceremony';
import { DatesForm } from './DatesForm';
import { LanguageEngagementHeader } from './Header';
import { ProgressAndPlanning } from './ProgressAndPlanning';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
  },
  details: {
    marginTop: spacing(4),
  },
  detailsCard: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    fontSize: '12px',
    fontWeight: 'bold',
    paddingTop: spacing(2),
    marginBottom: spacing(2),
  },
  addProductBtn: {
    marginLeft: spacing(2),
    width: 32,
    height: 32,
    minHeight: 32,
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
        <Grid item container spacing={3}>
          <Grid direction="column" item container xs={5}>
            <ProgressAndPlanning engagement={engagement} />

            <Grid item container className={classes.details}>
              <Typography variant="h3" paragraph>
                Translation Details
              </Typography>
            </Grid>
            <Grid item container>
              <Card className={classes.detailsCard}>
                <CardContent>
                  <Typography variant="h3" className={classes.header}>
                    DEDICATION DATE
                  </Typography>
                  <CeremonyForm ceremony={engagement.ceremony} />
                  <Divider />
                  <Typography variant="h3" className={classes.header}>
                    TRANSLATION DETAILS
                  </Typography>
                  <DatesForm engagement={engagement} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid direction="column" item container xs={7}>
            <Grid item container>
              <Typography variant="h3" paragraph>
                Products
              </Typography>
              <Link to="./products/create">
                <Fab
                  className={classes.addProductBtn}
                  color="error"
                  size="small"
                  aria-label="Add New Product"
                >
                  <Add />
                </Fab>
              </Link>
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
