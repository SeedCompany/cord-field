import { makeStyles, useTheme } from '@material-ui/core';
import { Column } from 'material-table';
import React, { FC } from 'react';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  FileActionsContextProvider,
  getPermittedFileActions,
} from '../files/FileActions';
import {
  PeriodicReportFragment,
  useUploadPeriodicReport,
} from '../PeriodicReportSummary';
import { Table } from '../Table';

const useStyles = makeStyles(({ spacing }) => ({
  actions: {
    padding: spacing(0),
  },
}));

export interface ReportRow {
  id: PeriodicReportFragment['id'];
  start: PeriodicReportFragment['start'];
  period: string;
  item: PeriodicReportFragment;
  modifiedBy: string;
  modifiedAt: string;
}

interface PeriodicReportsListProps {
  data: ReportRow[];
}

export const PeriodicReportsList: FC<PeriodicReportsListProps> = ({ data }) => {
  const classes = useStyles();
  const { palette, spacing } = useTheme();
  const uploadFile = useUploadPeriodicReport();

  const headerStyle: React.CSSProperties = {
    backgroundColor: palette.grey['100'],
    padding: spacing(1, 2),
  };

  const cellStyle: React.CSSProperties = {
    padding: spacing(1, 2),
  };

  const columns: Array<Column<ReportRow>> = [
    {
      title: 'ID',
      field: 'id',
      hidden: true,
    },
    {
      title: 'Period',
      field: 'period',
      customSort: (d1, d2) => d1.start.toMillis() - d2.start.toMillis(),
      defaultSort: 'desc',
      headerStyle,
      cellStyle,
    },
    {
      title: 'Submitted by',
      field: 'modifiedBy',
      headerStyle,
      cellStyle,
    },
    {
      title: 'Submitted Date',
      field: 'modifiedAt',
      headerStyle,
      cellStyle,
    },
    {
      title: '',
      field: 'item',
      align: 'right',
      headerStyle,
      cellStyle,
      render: (rowData: ReportRow) => {
        const reportFile = rowData.item.reportFile;
        const standardFileActions = getPermittedFileActions(
          reportFile.canRead,
          reportFile.canEdit
        );
        const noRenameFileActions = standardFileActions.filter(
          (action) => action !== FileAction.Rename
        );

        return (
          <ActionsMenu
            className={classes.actions}
            actions={noRenameFileActions}
            item={reportFile.value!}
            onVersionUpload={(files) =>
              uploadFile({
                files,
                parentId: rowData.id,
              })
            }
          />
        );
      },
    },
  ];

  return (
    <FileActionsContextProvider>
      <Table title="Final Reports" columns={columns} data={data} />
    </FileActionsContextProvider>
  );
};
