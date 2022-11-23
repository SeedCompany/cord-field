import { useMutation } from '@apollo/client';
import { Box } from '@mui/material';
import { GridRowEditStopParams } from '@mui/x-data-grid';
import { groupBy, isEmpty, sortBy } from 'lodash';
import { useMemo, useState } from 'react';
import { VariantFragment as Variant } from '~/common/fragments';
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

  const handleRowEditStop = useUpdateSteps();

  const [variant, setVariant] = useState<Variant | undefined>(
    () => progressByVariant.keys().next().value
  );

  const progressByCategory = variant
    ? progressByVariant.get(variant)!
    : undefined;

  if (!variant || !progressByCategory || isEmpty(progressByCategory)) {
    return <Error disableButtons>No progress available for this report.</Error>;
  }

  const variantSelector = (
    <VariantSelector
      variants={[...progressByVariant.keys()]}
      value={variant}
      onChange={setVariant}
    />
  );

  return (
    <Box mb={4}>
      <PnpFileAndSummary report={report} sx={{ mb: 4 }} />

      {Object.entries(progressByCategory).map(([category, progress]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <ProductTable
            category={category}
            products={progress}
            pagination
            header={() => variantSelector}
            editMode="row"
            onRowEditStop={handleRowEditStop}
          />
        </Box>
      ))}
    </Box>
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
