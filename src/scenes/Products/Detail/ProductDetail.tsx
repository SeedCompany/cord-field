import { useQuery } from '@apollo/client';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import {
  idForUrl,
  useChangesetAwareIdFromUrl,
} from '../../../components/Changeset';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { ResponsiveDivider } from '../../../components/ResponsiveDivider';
import { Link } from '../../../components/Routing';
import { ProductLoadError } from '../ProductLoadError';
import { ProductDetailDocument } from './ProductDetail.graphql';
import { ProductDetailHeader } from './ProductDetailHeader';
import { ProductInfo } from './ProductInfo';
import { StepsList } from './Progress';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    maxWidth: breakpoints.values.md,
  },
  details: {
    flex: 1,
  },
}));

export const ProductDetail = () => {
  const classes = useStyles();

  const { id, changesetId } = useChangesetAwareIdFromUrl('productId');
  const { data, error } = useQuery(ProductDetailDocument, {
    variables: {
      id,
      changesetId,
    },
  });
  const product = data?.product;
  const {
    progressOfCurrentReportDue: progress,
    progressStepMeasurement,
    progressTarget,
  } = product ?? {};

  if (error) {
    return <ProductLoadError error={error} />;
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
        <ProductDetailHeader product={product} />
        <Grid item container spacing={5} className={classes.details}>
          <Grid item md={4} container alignContent="flex-start" spacing={3}>
            <ProductInfo product={product} />
          </Grid>
          {progress && (
            <>
              <ResponsiveDivider vertical="mdUp" spacing={3} />
              <Grid item xs lg={7} container direction="column" spacing={2}>
                <Grid item component={Typography} variant="h3" paragraph>
                  Progress for{' '}
                  <Link to={`/progress-reports/${idForUrl(progress.report)}`}>
                    <ReportLabel report={progress.report} />
                  </Link>
                </Grid>
                <Grid item>
                  <StepsList
                    progress={progress}
                    measurement={progressStepMeasurement?.value}
                    target={progressTarget?.value}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};
