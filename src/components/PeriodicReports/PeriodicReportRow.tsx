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
          css={{
            color: skipped ? 'text.disabled' : undefined,
          }}
        />
      </div>
    </PaperTooltip>
  );
};
