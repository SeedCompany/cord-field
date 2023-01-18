import { useMutation } from '@apollo/client';
import { Stack } from '@mui/material';
import { groupBy, isEmpty, sortBy } from 'lodash';
import { useMemo, useState } from 'react';
import { Error } from '../../../../../components/Error';
import { UpdateStepProgressDocument } from '../../../../Products/Detail/Progress/ProductProgress.graphql';
import {
  ProductTable,
  RowData as ProductTableRowData,
} from '../../../Detail/ProductTable';
import { ReportProp } from '../../ReportProp';
import { PnpFileAndSummary } from './PnpFileAndSummary';
import { VariantSelector } from './VariantSelector';

export const ProgressStep = ({ report }: ReportProp) => {
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

  const processRowUpdate = useUpdateSteps();

  const [variant, setVariant] = useState(variants[variants.length - 1]);

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
            processRowUpdate,
            experimentalFeatures: {
              newEditingApi: true,
            },
          }}
        />
      ))}
    </Stack>
  );
};

const useUpdateSteps = () => {
  const [update] = useMutation(UpdateStepProgressDocument);
  return async (newRow: ProductTableRowData, oldRow: ProductTableRowData) => {
    const { product, report, variant, steps } = newRow.data;
    void update({
      variables: {
        input: {
          productId: product.id,
          reportId: report.id,
          variant: variant.key,
          steps: steps
            .filter(({ step }) => newRow[step]?.value !== oldRow[step]?.value)
            .map(({ step }) => ({
              step,
              completed: newRow[step]?.value,
            })),
        },
      },
      optimisticResponse: {
        updateProductProgress: {
          ...newRow.data,
          steps: steps.map(({ step }) => ({
            __typename: 'StepProgress',
            step,
            completed: newRow[step]!,
          })),
        },
      },
    });
    return newRow;
  };
};
