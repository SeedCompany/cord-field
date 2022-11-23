import { useMutation } from '@apollo/client';
import {
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { groupBy } from 'lodash';
import { useEffect, useState } from 'react';
import { VariantFragment } from '~/common/fragments';
import { useDialog } from '~/components/Dialog';
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

const sortCategories = (a: string, b: string) => {
  if (a === 'Scripture') {
    return -1;
  }
  if (b === 'Scripture') {
    return 1;
  }
  return a.localeCompare(b);
};

export const ProgressStep = () => {
  const { report } = useProgressReportContext();
  const [variant, setVariant] = useState<VariantFragment | null>(null);

  const [update] = useMutation(UpdateStepProgressDocument);

  // Single file for new version, empty array for received date update.
  const [dialogState, setUploading, upload] = useDialog<File[]>();

  const progressByVariant = Object.fromEntries(
    report.progressForAllVariants.map((progress) => {
      const variant = progress[0]!.variant.key;
      const progressByCategory = groupBy(
        progress,
        (product) => product.product.category
      );
      return [variant, progressByCategory];
    })
  );

  const variantObjects = Object.values(
    Object.fromEntries(
      report.progressForAllVariants.map((progress) => {
        const variant = progress[0]!.variant;
        return [variant.key, variant];
      })
    )
  );

  useEffect(() => {
    if (variantObjects.length > 0 && !variant) {
      setVariant(variantObjects[0]!);
    }
  }, [variantObjects, variant]);

  const current = variant?.key ?? '';
  const categories = Object.keys(progressByVariant[current] ?? {}).sort(
    sortCategories
  );
  const forTable = progressByVariant[current]!;

  if (categories.length === 0) {
    return (
      <Typography>
        No categories found for this report. Please contact support
      </Typography>
    );
  }

  return (
    <div
      css={(theme) => ({
        marginBottom: theme.spacing(4),
      })}
    >
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {current ? (
          <Grid item md={6}>
            <ProgressSummaryCard
              loading={!report}
              summary={report.cumulativeSummary ?? null}
              sx={{ height: 1 }}
            />
          </Grid>
        ) : null}
        <Grid container item md={current ? 6 : 12} spacing={2}>
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

      {categories.map((category) => (
        <Box key={category} sx={{ mb: 4 }}>
          <EditableProductTable
            products={forTable[category]}
            category={category}
            update={update}
            report={report}
            variant={variant}
            setVariant={setVariant}
            variants={variantObjects}
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
    </div>
  );
};

const EditableProductTable = ({
  variants,
  category,
  products = [],
  update,
  report,
  variant,
  setVariant,
}: {
  variants: VariantFragment[];
  category: string;
  products?: ProgressReportProgressFragment[];
  update: any;
  report: ProgressReportEditFragment;
  variant?: VariantFragment | null;
  setVariant: (variant: VariantFragment) => void;
}) => (
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
            variant: variant,
            steps: [
              ...fields.row.data.steps.map((step: StepProgressFragment) => ({
                completed: parseFloat(fields.row[step.step]),
                percentDone: parseFloat(fields.row[step.step]),
                step: step.step,
              })),
            ],
          },
        },
      });
    }}
  />
);

const VariantsToggle = ({
  variants,
  variant,
  setVariant,
}: {
  variant?: VariantFragment | null;
  setVariant: (variant: VariantFragment) => void;
  variants?: VariantFragment[];
}) => {
  const isSelected = (v: VariantFragment) => v.key === variant?.key;

  if (!variants || variants.length < 2) {
    return null;
  }

  return (
    <ToggleButtonGroup
      value={variant?.key ?? ''}
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
