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
import { ProgressOfProductForReportFragment } from '../../../Detail/ProgressReportDetail.graphql';
import { useProgressReportContext } from '../../../ProgressReportContext';
import { colorPalette } from '../../colorPalette';
import { ProgressReportEditFragment } from '../../ProgressReportEdit.graphql';
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
  const { currentReport } = useProgressReportContext();
  const [tab, setTab] = useState(0);

  const [update] = useMutation(UpdateStepProgressDocument);

  // Single file for new version, empty array for received date update.
  const [dialogState, setUploading, upload] = useDialog<File[]>();

  if (!currentReport?.progress) {
    return (
      <div>
        Something is wrong, we could not find the progress step in the current
        report
      </div>
    );
  }
  const grouped = groupBy(
    currentReport.progress,
    (product) => product.product.category
  );

  return (
    <div
      css={(theme) => ({
        marginBottom: theme.spacing(4),
      })}
    >
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {tab ? (
          <Grid item md={6}>
            <ProgressSummaryCard
              loading={!currentReport}
              summary={currentReport.cumulativeSummary ?? null}
              sx={{ height: 1 }}
            />
          </Grid>
        ) : null}
        <Grid container item md={tab ? 6 : 12} spacing={2}>
          {!currentReport.reportFile.value && (
            <Grid item md={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                (TENTATIVE COPY) Please upload the PnP for this reporting
                period. The progress data will populate the charts below.
              </Typography>
            </Grid>
          )}
          <Grid item md={6} justifyItems="end">
            <ProgressReportCard
              progressReport={currentReport}
              disableIcon
              onUpload={({ files }) => setUploading(files)}
            />
          </Grid>
        </Grid>
      </Grid>

      {Object.entries(grouped).map(([category, products]) => (
        <Box sx={{ mb: 4 }} key={category}>
          <EditableProductTable
            products={products}
            category={category}
            update={update}
            currentReport={currentReport}
            tab={tab}
            setTab={setTab}
          />
        </Box>
      ))}

      <UpdatePeriodicReportDialog
        {...dialogState}
        report={{ ...currentReport, reportFile: upload }}
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
  products,
  update,
  currentReport,
  tab,
  setTab,
}: {
  category: string;
  products: ProgressOfProductForReportFragment[];
  update: any;
  currentReport: ProgressReportEditFragment;
  tab: number;
  setTab: (tab: number) => void;
}) => (
  <ProductTable
    category={category}
    products={products}
    editable
    editMode="row"
    hidePagination={false}
    extendedHeader={<VariantsToggle setTab={setTab} tab={tab} />}
    onRowEditStop={(fields) => {
      void update({
        variables: {
          input: {
            productId: fields.id.toString(),
            reportId: currentReport.id,
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
