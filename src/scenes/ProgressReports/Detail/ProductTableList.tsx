import { Grid, Skeleton, Typography } from '@mui/material';
import { groupBy } from 'lodash';
import { ProductTable } from './ProductTable';
import { ProgressReportDetailFragment } from './ProgressReportDetail.graphql';
import { ProgressSummaryCard } from './ProgressSummaryCard';

interface ProductTableListProps {
  report?: ProgressReportDetailFragment | null;
}

export const ProductTableList = ({ report }: ProductTableListProps) => {
  const products = report?.progress;
  const grouped = groupBy(products, (product) => product.product.category);

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h3">
          {products ? 'Progress for Goals' : <Skeleton width="25%" />}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ProgressSummaryCard
          loading={!report}
          summary={report?.cumulativeSummary ?? null}
          sx={{
            maxWidth: 'md',
          }}
        />
      </Grid>
      <Grid container item xs={12} spacing={2}>
        {Object.entries(grouped).map(([category, products]) => (
          <Grid item key={category} xs={12}>
            <ProductTable category={category} products={products} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
