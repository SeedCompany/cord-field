import { useMutation } from '@apollo/client';
import {
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
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
import { colorPalette } from '../../colorPalette';
import { useProgressReportContext } from '../../ProgressReportContext';
import {
  ProgressReportEditFragment,
  ProgressReportProgressFragment,
} from '../../ProgressReportEdit.graphql';
import { RoleIcon } from '../../RoleIcon';

const transparentBgSx = {
  backgroundColor: 'transparent',
};

const iconSx = {
  height: 36,
  width: 36,
  mr: 0,
};

const ToggleButtonSx = (role: string) => ({
  p: 0.25,
  pr: 1,
  mr: 0,
  borderRadius: 0.6,
  '&.Mui-selected': {
    backgroundColor: colorPalette.stepperCard.iconBackground[role],
  },
  '&.Mui-selected:hover': {
    backgroundColor: colorPalette.stepperCard.iconBackground[role],
  },
});

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
          <VariantsToggle
            variant={variant}
            variants={variants}
            setVariant={setVariant}
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

const VariantsToggle = ({
  variants,
  variant,
  setVariant,
}: {
  variant: Variant;
  setVariant: (variant: Variant) => void;
  variants: Variant[];
}) => {
  const isSelected = (v: Variant) => v.key === variant.key;

  if (variants.length < 2) {
    return null;
  }

  return (
    <ToggleButtonGroup
      value={variant.key}
      exclusive
      onChange={(_e, value) => {
        if (value !== null) {
          setVariant(variants.find((v) => v.key === value) ?? variants[0]!);
        }
      }}
      color="secondary"
      sx={{ mt: 1, ml: 1 }}
    >
      {variants.map((v) => (
        <ToggleButton
          key={v.key}
          value={v.key}
          sx={[
            ToggleButtonSx(v.responsibleRole!),
            isSelected(v) && transparentBgSx,
          ]}
        >
          <RoleIcon
            variantRole={v.responsibleRole}
            sx={[iconSx, !isSelected(v) && transparentBgSx]}
          />
          {v.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
