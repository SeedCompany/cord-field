import { Box, Chip } from '@mui/material';
import { ProgressReportStatusLabels as StatusLabels } from '~/api/schema/enumLists';
import { flexColumn, StyleProps } from '~/common';
import { InstructionsButton } from './InstructionsDialog';
import { ProgressReportStepper } from './ProgressReportStepper';
import { ReportDue } from './ReportDue';
import { ReportProp } from './ReportProp';

export const ProgressReportSidebar = ({
  report,
  ...rest
}: ReportProp & StyleProps) => (
  <Box {...rest} css={(theme) => [flexColumn, { gap: theme.spacing(2) }]}>
    <InstructionsButton />
    {report.status.value && (
      <Chip color="info" label={StatusLabels[report.status.value]!} />
    )}
    <div css={{ alignSelf: 'center' }}>
      <ReportDue date={report.due} />
    </div>
    <ProgressReportStepper />
  </Box>
);
