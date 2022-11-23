import { useMutation } from '@apollo/client';
import { Box, Grid, Typography } from '@mui/material';
import { GridRowEditStopParams } from '@mui/x-data-grid';
import { groupBy, isEmpty, sortBy } from 'lodash';
import { useMemo, useState } from 'react';
import { VariantFragment as Variant } from '~/common/fragments';
import { useDialog } from '~/components/Dialog';
import { Error } from '../../../../../components/Error';
import { UpdateStepProgressDocument } from '../../../../Products/Detail/Progress/ProductProgress.graphql';
import { ProgressSummaryCard } from '../../../../ProgressReports/Detail/ProgressSummaryCard';
import { UpdatePeriodicReportDialog } from '../../../../Projects/Reports/UpdatePeriodicReportDialog';
import {
  ProductTable,
  RowData as ProductTableRowData,
} from '../../../Detail/ProductTable';
import { ProgressReportCard } from '../../../Detail/ProgressReportCard';
import { useProgressReportContext } from '../../ProgressReportContext';
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

  // Single file for new version, empty array for received date update.
  const [dialogState, setUploading, upload] = useDialog<File[]>();

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
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {report.cumulativeSummary ? (
          <Grid item md={6}>
            <ProgressSummaryCard
              loading={false}
              summary={report.cumulativeSummary}
              sx={{ height: 1 }}
            />
          </Grid>
        ) : null}
        <Grid container item md={report.cumulativeSummary ? 6 : 12} spacing={2}>
          {!report.reportFile.value && (
            <Grid item md={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                (TENTATIVE COPY) Please upload the PnP for this reporting
                period. The progress data will populate the charts below.
              </Typography>
            </Grid>
          )}
          <Grid item md={6} justifyItems="end">
            <ProgressReportCard
              progressReport={report}
              disableIcon
              onUpload={({ files }) => setUploading(files)}
            />
          </Grid>
        </Grid>
      </Grid>

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

      <UpdatePeriodicReportDialog
        {...dialogState}
        report={{ ...report, reportFile: upload }}
        editFields={[
          'receivedDate',
          ...(upload && upload.length > 0 ? ['reportFile' as const] : []),
        ]}
      />
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
