import { useMutation } from '@apollo/client';
import {
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { groupBy } from 'lodash';
import { useState } from 'react';
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

const variants = ['partner', 'official'] as const;

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
  const [tab, setTab] = useState<typeof variants[number]>('partner');

  const [update] = useMutation(UpdateStepProgressDocument);

  // Single file for new version, empty array for received date update.
  const [dialogState, setUploading, upload] = useDialog<File[]>();

  const groups: Record<
    string,
    Record<string, ProgressReportProgressFragment[]>
  > = {};

  report.progressForAllVariants.map((progress) => {
    const grouped = groupBy(progress, (product) => product.product.category);
    groups[progress[0]!.variant.key] = grouped;
    return progress;
  });

  const categories = Object.keys(groups[tab]!).sort(sortCategories);
  const forTable = groups[tab]!;
  const tabIndex = variants.indexOf(tab);

  return (
    <div
      css={(theme) => ({
        marginBottom: theme.spacing(4),
      })}
    >
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {tabIndex ? (
          <Grid item md={6}>
            <ProgressSummaryCard
              loading={!report}
              summary={report.cumulativeSummary ?? null}
              sx={{ height: 1 }}
            />
          </Grid>
        ) : null}
        <Grid container item md={tabIndex ? 6 : 12} spacing={2}>
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
            tab={tab}
            setTab={setTab}
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
  category,
  products = [],
  update,
  report,
  tab,
  setTab,
}: {
  category: string;
  products?: ProgressReportProgressFragment[];
  update: any;
  report: ProgressReportEditFragment;
  tab: typeof variants[number];
  setTab: (tab: typeof variants[number]) => void;
}) => (
  <ProductTable
    category={category}
    products={products}
    pagination
    header={() => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <VariantsToggle
          setTab={(value) => setTab(variants[value] ?? variants[0])}
          tab={variants.indexOf(tab)}
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
            variant: tab,
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
  tab,
  setTab,
}: {
  tab: number;
  setTab: (tab: number) => void;
}) => {
  return (
    <ToggleButtonGroup
      value={tab}
      exclusive
      onChange={(_e, value) => {
        if (value !== null) {
          setTab(value);
        }
      }}
      color="secondary"
      sx={{ mt: 1, ml: 1 }}
    >
      <ToggleButton
        value={0}
        sx={[ToggleButtonSx('FieldPartner'), tab !== 0 && transparentBgSx]}
      >
        <RoleIcon
          // eslint-disable-next-line jsx-a11y/aria-role
          role="FieldPartner"
          sx={[iconSx, tab !== 0 && transparentBgSx]}
        />
        Field Partner
      </ToggleButton>
      <ToggleButton
        value={1}
        sx={[ToggleButtonSx('ProjectManager'), tab !== 1 && transparentBgSx]}
      >
        <RoleIcon
          // eslint-disable-next-line jsx-a11y/aria-role
          role="ProjectManager"
          sx={[iconSx, tab !== 1 && transparentBgSx]}
        />
        Field Operations
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
