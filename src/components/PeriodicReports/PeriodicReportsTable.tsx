import { makeStyles, useTheme } from '@material-ui/core';
import { SkipNextRounded as SkipIcon } from '@material-ui/icons';
import { Many, without } from 'lodash';
import { DateTime } from 'luxon';
import { Column } from 'material-table';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Except } from 'type-fest';
import { CalendarDate } from '~/common';
import { SkipPeriodicReportDialog } from '../../scenes/Projects/Reports/SkipPeriodicReportDialog';
import {
  EditablePeriodicReportField,
  UpdatePeriodicReportDialog,
} from '../../scenes/Projects/Reports/UpdatePeriodicReportDialog';
import { useDialog } from '../Dialog';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  FileActionsContextProvider,
  getPermittedFileActions,
  useFileActions,
} from '../files/FileActions';
import { FormattedDate, FormattedDateTime } from '../Formatters';
import { Table } from '../Table';
import { TableProps } from '../Table/Table';
import { PeriodicReportFragment } from './PeriodicReport.graphql';
import { PeriodicReportRow } from './PeriodicReportRow';
import { ReportLabel } from './ReportLabel';
import { useUpdatePeriodicReport } from './Upload/useUpdatePeriodicReport';

export interface ReportRow {
  report: PeriodicReportFragment;
  period: CalendarDate;
  modifiedBy: string;
  modifiedAt?: DateTime;
}

const useStyles = makeStyles(() => ({
  label: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1',
  },
}));

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
  const uploadFile = useUpdatePeriodicReport();
  const { openFilePreview } = useFileActions();
  const { enqueueSnackbar } = useSnackbar();
  const [reportBeingEdited, editReport] = useState<
    Omit<PeriodicReportFragment, 'reportFile'> & { reportFile?: File[] }
  >();

  const [editState, editField, fieldsBeingEdited] =
    useDialog<Many<EditablePeriodicReportField>>();

  const rowsData = (data ?? []).map(
    (report): ReportRow => ({
      report,
      period: report.start,
      modifiedBy: report.reportFile.value?.modifiedBy.fullName || '',
      modifiedAt: report.reportFile.value?.modifiedAt,
    })
  );

  const classes = useStyles();
  const theme = useTheme();

  const columns: Array<Column<ReportRow>> = [
    {
      title: 'Period',
      defaultSort: 'desc',
      render: ({ report }) => (
        <span className={classes.label}>
          <ReportLabel report={report} />
          {report.skippedReason.value && <SkipIcon fontSize="small" />}
        </span>
      ),
      customSort: (row1, row2) =>
        row1.period.toMillis() - row2.period.toMillis(),
    },
    {
      title: 'Submitted By',
      field: 'modifiedBy',
      render: ({ modifiedBy, report }) => {
        return report.skippedReason.value ? <>&mdash;</> : modifiedBy;
      },
    },
    {
      title: 'Submitted Date',
      field: 'modifiedAt',
      render: ({ report }) =>
        report.skippedReason.value ? (
          <>&mdash;</>
        ) : (
          <FormattedDateTime date={report.reportFile.value?.modifiedAt} />
        ),
    },
    {
      title: 'Received Date',
      field: 'receivedDate',
      render: ({ report }) =>
        report.skippedReason.value ? (
          <>&mdash;</>
        ) : (
          <FormattedDate date={report.receivedDate.value} />
        ),
    },
    {
      title: '',
      field: 'item',
      align: 'right',
      sorting: false,
      render: ({ report }) => {
        const reportFile = report.reportFile;
        const fileActions = reportFile.value
          ? without(
              getPermittedFileActions(reportFile.canRead, reportFile.canEdit),
              FileAction.Delete,
              FileAction.Rename
            )
          : reportFile.canEdit && !report.skippedReason.value
          ? [FileAction.NewVersion]
          : [];

        return (
          <ActionsMenu
            IconButtonProps={{ size: 'small' }}
            actions={{
              file: [
                ...fileActions,
                ...(report.receivedDate.canEdit && !report.skippedReason.value
                  ? [FileAction.UpdateReceivedDate]
                  : []),
                ...(!report.receivedDate.value && !report.skippedReason.value
                  ? [FileAction.Skip]
                  : []),
                ...(report.skippedReason.value
                  ? [FileAction.EditSkipReason]
                  : []),
              ],
              version: [
                FileAction.Download,
                ...(reportFile.canEdit
                  ? [FileAction.Rename, FileAction.Delete]
                  : []),
              ],
            }}
            // @ts-expect-error refactor file functionality later to make all this easier
            item={reportFile.value ?? { __typename: '' }}
            onVersionUpload={(files) =>
              reportBeingEdited
                ? async () => {
                    editReport(undefined);
                    await uploadFile(report.id, files);
                  }
                : () => {
                    return;
                  }
            }
            onVersionAccepted={(files) => {
              editReport({
                ...report,
                reportFile: files,
              });
              editField(['reportFile', 'receivedDate']);
            }}
            onUpdateReceivedDate={() => {
              editReport({ ...report, reportFile: undefined });
              editField('receivedDate');
            }}
            onSkip={() => {
              editReport({ ...report, reportFile: undefined });
              editField('skippedReason');
            }}
            onEditSkipReason={() => {
              editReport({ ...report, reportFile: undefined });
              editField('skippedReason');
            }}
          />
        );
      },
    },
  ];

  return (
    <>
      {reportBeingEdited && fieldsBeingEdited === 'skippedReason' ? (
        <SkipPeriodicReportDialog {...editState} report={reportBeingEdited} />
      ) : reportBeingEdited?.receivedDate.canEdit ? (
        <UpdatePeriodicReportDialog
          {...editState}
          editFields={fieldsBeingEdited}
          report={reportBeingEdited}
        />
      ) : null}

      <Table<ReportRow>
        isLoading={!data}
        {...props}
        data={rowsData}
        components={{
          // No toolbar since it's just empty space, we don't use it for anything.
          Toolbar: () => null,
          Row: PeriodicReportRow,
        }}
        columns={columns}
        onRowClick={(rowData) => {
          if (props.onRowClick) {
            props.onRowClick(rowData);
          } else {
            const { report } = rowData;
            if (!report.reportFile.canRead) {
              enqueueSnackbar(
                `You don't have permission to view this report file`
              );
              return;
            }
            if (report.reportFile.value) {
              openFilePreview(report.reportFile.value);
              return;
            }
            if (report.reportFile.canEdit) {
              // TODO Upload
            }
          }
        }}
        options={{
          padding: 'dense',
          thirdSortClick: false,
          draggable: false,
          rowStyle: ({ report }: ReportRow) =>
            report.skippedReason.value
              ? {
                  color: theme.palette.text.disabled,
                }
              : {},
          ...props.options,
        }}
      />
    </>
  );
};

export const PeriodicReportsTable = (props: PeriodicReportsTableProps) => (
  <FileActionsContextProvider>
    <PeriodicReportsTableInContext {...props} />
  </FileActionsContextProvider>
);
