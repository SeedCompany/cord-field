import { useQuery } from '@apollo/client';
import { Card, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { ResponsiveDivider } from '../../../components/ResponsiveDivider';
import { ProductDetailDocument } from './ProductDetail.generated';
import { ProductDetailHeader } from './ProductDetailHeader';
import { ProductInfo } from './ProductInfo';

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
    maxWidth: breakpoints.values.lg,
  },
}));

export const ProductDetail = () => {
  const classes = useStyles();

  const { data } = useQuery(ProductDetailDocument, {
    variables: {
      id: useParams().productId,
    },
  });
  const product = data?.product;
  const progress = product?.progressOfCurrentReportDue;

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
        <Grid item xs container spacing={5}>
          <Grid item lg={3} container direction="column" spacing={3}>
            <ProductInfo product={product} />
          </Grid>
          {progress && (
            <>
              <ResponsiveDivider vertical="lgUp" spacing={3} />
              <Grid item xs md lg container direction="column" spacing={2}>
                <Grid item component={Typography} variant="h3" paragraph>
                  Progress for <ReportLabel report={progress.report} />
                </Grid>
                {progress.steps.map(({ step, percentDone }) => (
                  <Grid item key={step}>
                    <Card>{step}</Card>
                  </Grid>
                ))}
                {progress.steps.length === 0 && (
                  <Grid item component={Typography} color="textSecondary">
                    Product does not have any steps
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};
