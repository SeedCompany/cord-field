import { MTableBodyRow } from 'material-table';
import React from 'react';
import { PaperTooltip } from '../PaperTooltip';
import { ReportRow } from './PeriodicReportsTable';

export const PeriodicReportRow = (props: { data: ReportRow }) => {
  return (
    <PaperTooltip
      title={props.data.report.skippedReason.value ?? ''}
      placement="bottom-start"
      arrow={false}
    >
      <MTableBodyRow {...props} />
    </PaperTooltip>
  );
};
