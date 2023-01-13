import { SkipNextRounded as SkipIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useDialog } from '../../../components/Dialog';
import { IconButton } from '../../../components/IconButton';
import {
  SkipPeriodicReportDialog,
  SkipPeriodicReportDialogProps,
} from './SkipPeriodicReportDialog';

export const SkipReportButton = ({
  report,
}: Partial<Pick<SkipPeriodicReportDialogProps, 'report'>>) => {
  const isSkipped = report?.skippedReason.value;
  const [skipState, openSkip] = useDialog();
  if (report && !report.skippedReason.canEdit) {
    return null;
  }
  return (
    <>
      <Tooltip title={isSkipped ? 'Edit Skipped Reason' : 'Skip Report'}>
        <IconButton loading={!report} onClick={openSkip}>
          <SkipIcon />
        </IconButton>
      </Tooltip>
      {report && <SkipPeriodicReportDialog {...skipState} report={report} />}
    </>
  );
};
