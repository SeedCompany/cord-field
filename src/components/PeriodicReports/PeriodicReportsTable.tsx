import { without } from 'lodash';
import { DateTime } from 'luxon';
import { Column } from 'material-table';
import React from 'react';
import { useNavigate } from 'react-router';
import { Except } from 'type-fest';
import { CalendarDate } from '../../util';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  FileActionsContextProvider,
  getPermittedFileActions,
} from '../files/FileActions';
import { FormattedDateTime } from '../Formatters';
import { Table } from '../Table';
import { TableProps } from '../Table/Table';
import { PeriodicReportFragment } from './PeriodicReport.generated';
import { ReportLabel } from './ReportLabel';
import { useUploadPeriodicReport } from './Upload/useUploadPeriodicReport';

export interface ReportRow {
  report: PeriodicReportFragment;
  period: CalendarDate;
  modifiedBy: string;
  modifiedAt?: DateTime;
}

type PeriodicReportsTableProps = Except<
  TableProps<ReportRow>,
  'columns' | 'components' | 'data'
> & {
  data?: readonly PeriodicReportFragment[];
};

export const PeriodicReportsTableInContext = ({
  data,
  ...props
}: PeriodicReportsTableProps) => {
  const uploadFile = useUploadPeriodicReport();
  const navigate = useNavigate();

  const rowsData = (data ?? []).map(
    (report): ReportRow => ({
      report,
      period: report.start,
      modifiedBy: report.reportDirectory.value?.createdBy.fullName || '',
      modifiedAt: report.reportDirectory.value?.createdAt,
    })
  );

  const columns: Array<Column<ReportRow>> = [
    {
      title: 'Period',
      defaultSort: 'desc',
      render: ({ report }) => <ReportLabel report={report} />,
      customSort: (row1, row2) =>
        row1.period.toMillis() - row2.period.toMillis(),
    },
    {
      title: 'Submitted By',
      field: 'modifiedBy',
    },
    {
      title: 'Submitted Date',
      field: 'modifiedAt',
      render: ({ report }) => (
        <FormattedDateTime date={report.reportDirectory.value?.createdAt} />
      ),
    },
    {
      title: '',
      field: 'item',
      align: 'right',
      sorting: false,
      render: ({ report }) => {
        const reportDirectory = report.reportDirectory;
        const fileActions = without(
          getPermittedFileActions(true, true),
          FileAction.Delete,
          FileAction.Rename
        );

        return (
          <ActionsMenu
            IconButtonProps={{ size: 'small' }}
            actions={{
              file: fileActions,
              version: [FileAction.Download],
            }}
            // @ts-expect-error refactor file functionality later to make all this easier
            item={reportDirectory.value ?? { __typename: '' }}
            onVersionUpload={(files) => uploadFile(files, report.id)}
          />
        );
      },
    },
  ];

  return (
    <Table<ReportRow>
      isLoading={!data}
      {...props}
      data={rowsData}
      components={{
        // No toolbar since it's just empty space, we don't use it for anything.
        Toolbar: () => null,
      }}
      columns={columns}
      onRowClick={({ report }) => {
        navigate(`${report.id}/files`);
      }}
      options={{
        padding: 'dense',
        thirdSortClick: false,
        draggable: false,
        ...props.options,
      }}
    />
  );
};

export const PeriodicReportsTable = (props: PeriodicReportsTableProps) => (
  <FileActionsContextProvider>
    <PeriodicReportsTableInContext {...props} />
  </FileActionsContextProvider>
);
