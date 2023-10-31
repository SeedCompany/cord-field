import { SkipNextRounded as SkipIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';
import { Many } from '@seedcompany/common';
import { without } from 'lodash';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Except } from 'type-fest';
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
import { PeriodicReportFragment } from './PeriodicReport.graphql';
import { PeriodicReportRow } from './PeriodicReportRow';
import { ReportLabel } from './ReportLabel';
import { useUpdatePeriodicReport } from './Upload/useUpdatePeriodicReport';

type PeriodicReportsTableProps = Except<
  DataGridProps<PeriodicReportFragment>,
  'columns' | 'rows'
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

  const columns: Array<GridColDef<PeriodicReportFragment>> = [
    {
      headerName: 'Period',
      field: 'start',
      width: 135,
      renderCell: ({ row: report }) => (
        <Box component="span" display="inline-flex" alignItems="center" gap={1}>
          <ReportLabel report={report} />
          {report.skippedReason.value && <SkipIcon fontSize="small" />}
        </Box>
      ),
      sortingOrder: ['desc', 'asc'], // no "unsorted"
    },
    {
      headerName: 'Submitted By',
      field: 'modifiedBy',
      width: 200,
      valueGetter: ({ row }) => row.reportFile.value?.modifiedBy.fullName,
      renderCell: ({ row: report, value }) =>
        report.skippedReason.value ? <>&mdash;</> : value,
    },
    {
      headerName: 'Submitted Date',
      field: 'modifiedAt',
      width: 150,
      valueGetter: ({ row }) => row.reportFile.value?.modifiedAt,
      renderCell: ({ row: report }) =>
        report.skippedReason.value ? (
          <>&mdash;</>
        ) : (
          <FormattedDateTime date={report.reportFile.value?.modifiedAt} />
        ),
    },
    {
      headerName: 'Received Date',
      field: 'receivedDate',
      width: 150,
      renderCell: ({ row: report }) =>
        report.skippedReason.value ? (
          <>&mdash;</>
        ) : (
          <FormattedDate date={report.receivedDate.value} />
        ),
    },
    {
      headerName: '',
      field: 'report',
      flex: 1,
      align: 'right',
      sortable: false,
      renderCell: ({ row: report }) => {
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

      <DataGrid<PeriodicReportFragment>
        loading={!data}
        density="compact"
        initialState={{
          sorting: {
            sortModel: [{ field: 'start', sort: 'desc' }],
          },
        }}
        disableColumnMenu
        disableSelectionOnClick
        autoHeight
        sx={{
          '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
          '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
            '&:focus, &:focus-within': { outline: 'none' },
          },
          '& .MuiDataGrid-columnHeader:nth-last-of-type(-n+2) .MuiDataGrid-columnSeparator--sideRight':
            {
              display: 'none',
            },
        }}
        {...props}
        rows={data ?? []}
        components={{
          Row: PeriodicReportRow,
          Footer: () => null,
          ...props.components,
        }}
        columns={columns}
        onRowClick={(params, event, details) => {
          if (props.onRowClick) {
            props.onRowClick(params, event, details);
          } else {
            const report = params.row as PeriodicReportFragment;
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
      />
    </>
  );
};

export const PeriodicReportsTable = (props: PeriodicReportsTableProps) => (
  <FileActionsContextProvider>
    <PeriodicReportsTableInContext {...props} />
  </FileActionsContextProvider>
);
