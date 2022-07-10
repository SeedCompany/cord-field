import { PaperTooltip } from '../PaperTooltip';
import { ReportRow } from './PeriodicReportsTable';

// TODO Reimplement table
const MTableBodyRow = (..._props: any) => <div>row</div>;

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
