import { useMutation } from '@apollo/client';
import { Box, Grid, Typography } from '@mui/material';
import { groupBy, isEmpty, sortBy } from 'lodash';
import { useMemo, useState } from 'react';
import { VariantFragment as Variant } from '~/common/fragments';
import { useDialog } from '~/components/Dialog';
import { Error } from '../../../../../components/Error';
import {
  StepProgressFragment,
  UpdateStepProgressDocument,
} from '../../../../Products/Detail/Progress/ProductProgress.graphql';
import { ProgressSummaryCard } from '../../../../ProgressReports/Detail/ProgressSummaryCard';
import { UpdatePeriodicReportDialog } from '../../../../Projects/Reports/UpdatePeriodicReportDialog';
import { ProductTable } from '../../../Detail/ProductTable';
import { ProgressReportCard } from '../../../Detail/ProgressReportCard';
import { useProgressReportContext } from '../../ProgressReportContext';
import {
  ProgressReportEditFragment,
  ProgressReportProgressFragment,
} from '../../ProgressReportEdit.graphql';
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
          <EditableProductTable
            products={progress}
            category={category}
            report={report}
            variant={variant}
            setVariant={setVariant}
            variants={[...progressByVariant.keys()]}
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

const EditableProductTable = ({
  variants,
  category,
  products,
  report,
  variant,
  setVariant,
}: {
  variants: Variant[];
  category: string;
  products: ProgressReportProgressFragment[];
  report: ProgressReportEditFragment;
  variant: Variant;
  setVariant: (variant: Variant) => void;
}) => {
  const [update] = useMutation(UpdateStepProgressDocument);

  return (
    <ProductTable
      category={category}
      products={products}
      pagination
      header={() => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <VariantSelector
            variants={variants}
            value={variant}
            onChange={setVariant}
          />
        </div>
      )}
      editMode="row"
      onRowEditStop={(fields) => {
        void update({
          variables: {
            input: {
              productId: fields.id.toString(),
              reportId: report.id,
              variant: variant.key,
              steps: [
                ...fields.row.data.steps.map((step: StepProgressFragment) => ({
                  completed: parseFloat(fields.row[step.step]),
                  step: step.step,
                })),
              ],
            },
          },
        });
      }}
    />
  );
};
