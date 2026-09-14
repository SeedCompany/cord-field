import { GridRow, GridRowProps } from '@mui/x-data-grid-pro';
import { createContext, ReactNode, useContext } from 'react';
import { PaperTooltip } from '../PaperTooltip';
import type { PeriodicReportFileField } from './fileField';
import { PeriodicReportFragment } from './PeriodicReport.graphql';

const PeriodicReportFileFieldContext =
  createContext<PeriodicReportFileField>('reportFile');

export const PeriodicReportFileFieldProvider = ({
  fileField,
  children,
}: {
  fileField: PeriodicReportFileField;
  children: ReactNode;
}) => (
  <PeriodicReportFileFieldContext.Provider value={fileField}>
    {children}
  </PeriodicReportFileFieldContext.Provider>
);

export const PeriodicReportRow = (props: GridRowProps) => {
  const fileField = useContext(PeriodicReportFileFieldContext);
  const report = props.row as PeriodicReportFragment;
  const skipped = report.skippedReason.value;
  const file = report[fileField];
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
            cursor:
              skipped || (file.canRead && !file.value) ? undefined : 'pointer',
          })}
        />
      </div>
    </PaperTooltip>
  );
};
