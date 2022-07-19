import { MTableBodyRow } from 'material-table';
import { PaperTooltip } from '../PaperTooltip';
import { ReportRow } from './PeriodicReportsTable';

export const PeriodicReportRow = (props: { data: ReportRow }) => {
  const skipped = props.data.report.skippedReason.value;
  return (
    <PaperTooltip
      title={skipped ? <>Skipped&mdash;{skipped}</> : ''}
      placement="bottom-start"
      arrow={false}
    >
      <MTableBodyRow {...props} />
    </PaperTooltip>
  );
};
