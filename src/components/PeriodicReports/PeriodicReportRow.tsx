import { GridRow, GridRowProps } from '@mui/x-data-grid';
import { PaperTooltip } from '../PaperTooltip';
import { PeriodicReportFragment } from './PeriodicReport.graphql';

export const PeriodicReportRow = (props: GridRowProps) => {
  const report = props.row as PeriodicReportFragment;
  const skipped = report.skippedReason.value;
  return (
    <PaperTooltip
      title={skipped ? <>Skipped&mdash;{skipped}</> : ''}
      placement="bottom-start"
      arrow={false}
    >
      <div>
        <GridRow
          {...props}
          css={(theme) => ({
            color: skipped ? theme.palette.text.disabled : undefined,
          })}
        />
      </div>
    </PaperTooltip>
  );
};
