import { useMutation } from '@apollo/client';
import { Stack } from '@mui/material';
import { GridRowEditStopParams } from '@mui/x-data-grid';
import { groupBy, isEmpty, sortBy } from 'lodash';
import { useMemo, useState } from 'react';
import { Error } from '../../../../../components/Error';
import { UpdateStepProgressDocument } from '../../../../Products/Detail/Progress/ProductProgress.graphql';
import {
  ProductTable,
  RowData as ProductTableRowData,
} from '../../../Detail/ProductTable';
import { useProgressReportContext } from '../../ProgressReportContext';
import { PnpFileAndSummary } from './PnpFileAndSummary';
import { VariantSelector } from './VariantSelector';

export const ProgressStep = () => {
  const { report } = useProgressReportContext();

  const progressByVariant = useMemo(
    () =>
      new Map(
        report.progressForAllVariants.map((progress) => {
          const { variant } = progress[0]!;
          const progressByCategory = groupBy(
            sortBy(progress, ({ product: { category } }) =>
              category === 'Scripture' ? '' : category
            ),
            (product) => product.product.category
          );
          return [variant, progressByCategory];
        })
      ),
    [report]
  );
  const variants = [...progressByVariant.keys()];

  const handleRowEditStop = useUpdateSteps();

  const [variant, setVariant] = useState(variants[0]);

  const progressByCategory = variant
    ? progressByVariant.get(variant)!
    : undefined;

  if (!variant || !progressByCategory || isEmpty(progressByCategory)) {
    return <Error disableButtons>No progress available for this report.</Error>;
  }

  const variantSelector = (
    <VariantSelector
      variants={variants}
      value={variant}
      onChange={setVariant}
    />
  );

  return (
    <Stack spacing={4}>
      <PnpFileAndSummary report={report} />

      {Object.entries(progressByCategory).map(([category, progress]) => (
        <ProductTable
          key={category}
          category={category}
          products={progress}
          GridProps={{
            pagination: true,
            components: {
              Header: () => variantSelector,
            },
            editMode: 'row',
            onRowEditStop: handleRowEditStop,
          }}
        />
      ))}
    </Stack>
  );
};

const useUpdateSteps = () => {
  const [update] = useMutation(UpdateStepProgressDocument);
  return (params: GridRowEditStopParams<ProductTableRowData>) => {
    const { product, report, variant, steps } = params.row.data;
    void update({
      variables: {
        input: {
          productId: product.id,
          reportId: report.id,
          variant: variant.key,
          steps: steps.map(({ step }) => {
            const raw = params.row[step];
            return {
              step,
              completed: raw ? parseFloat(raw) : null,
            };
          }),
        },
      },
    });
  };
};
