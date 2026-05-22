import { SkipNextRounded as SkipIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
  GridColDef,
} from '@mui/x-data-grid-pro';
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
import {
  dateFieldFor,
  PeriodicReportEditShape,
  PeriodicReportFileField,
} from './fileField';
import { PeriodicReportFragment } from './PeriodicReport.graphql';
import {
  PeriodicReportFileFieldProvider,
  PeriodicReportRow,
} from './PeriodicReportRow';
import { ReportLabel } from './ReportLabel';
import { useUpdatePeriodicReport } from './Upload/useUpdatePeriodicReport';

type PeriodicReportsTableProps = Except<
  DataGridProps<PeriodicReportFragment>,
  'columns' | 'rows'
> & {
  data?: readonly PeriodicReportFragment[];
  fileField?: PeriodicReportFileField;
};

export const PeriodicReportsTableInContext = ({
  data,
  fileField = 'reportFile',
  ...props
}: PeriodicReportsTableProps) => {
  const uploadFile = useUpdatePeriodicReport(fileField);
  const dateField = dateFieldFor(fileField);
  const { openFilePreview } = useFileActions();
  const { enqueueSnackbar } = useSnackbar();
  const [reportBeingEdited, editReport] = useState<PeriodicReportEditShape>();

  const [editState, editField, fieldsBeingEdited] =
    useDialog<Many<EditablePeriodicReportField>>();

  const columns: Array<GridColDef<PeriodicReportFragment>> = [
    {
      headerName: 'Period',
      field: 'start',
      width: 150,
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
      valueGetter: (_, row) => row[fileField].value?.modifiedBy.fullName,
      renderCell: ({ row: report, value }) =>
        report.skippedReason.value ? <>&mdash;</> : value,
    },
    {
      headerName: 'Submitted Date',
      field: 'modifiedAt',
      width: 150,
      valueGetter: (_, row) => row[fileField].value?.modifiedAt,
      renderCell: ({ row: report }) =>
        report.skippedReason.value ? (
          <>&mdash;</>
        ) : (
          <FormattedDateTime date={report[fileField].value?.modifiedAt} />
        ),
    },
    {
      headerName: 'Received Date',
      field: dateField,
      width: 150,
      renderCell: ({ row: report }) =>
        report.skippedReason.value ? (
          <>&mdash;</>
        ) : (
          <FormattedDate date={report[dateField].value} />
        ),
    },
    {
      headerName: '',
      field: 'report',
      flex: 1,
      align: 'right',
      sortable: false,
      renderCell: ({ row: report }) => {
        const file = report[fileField];
        const fileActions = file.value
          ? without(
              getPermittedFileActions(file.canRead, file.canEdit),
              FileAction.Delete,
              FileAction.Rename
            )
          : file.canEdit && !report.skippedReason.value
          ? [FileAction.NewVersion]
          : [];

        return (
          <ActionsMenu
            IconButtonProps={{ size: 'small' }}
            actions={{
              file: [
                ...fileActions,
                ...(report[dateField].canEdit && !report.skippedReason.value
                  ? [FileAction.UpdateReceivedDate]
                  : []),
                ...(!report[dateField].value && !report.skippedReason.value
                  ? [FileAction.Skip]
                  : []),
                ...(report.skippedReason.value
                  ? [FileAction.EditSkipReason]
                  : []),
              ],
              version: [
                FileAction.Download,
                ...(file.canEdit ? [FileAction.Rename, FileAction.Delete] : []),
              ],
            }}
            // @ts-expect-error refactor file functionality later to make all this easier
            item={file.value ?? { __typename: '' }}
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
                [fileField]: files,
              });
              editField([fileField, dateField]);
            }}
            onUpdateReceivedDate={() => {
              editReport({ ...report, [fileField]: undefined });
              editField(dateField);
            }}
            onSkip={() => {
              editReport({ ...report, [fileField]: undefined });
              editField('skippedReason');
            }}
            onEditSkipReason={() => {
              editReport({ ...report, [fileField]: undefined });
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
      ) : reportBeingEdited?.[dateField].canEdit ? (
        <UpdatePeriodicReportDialog
          {...editState}
          editFields={fieldsBeingEdited}
          fileField={fileField}
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
        disableRowSelectionOnClick
        autoHeight
        hideFooter
        sx={{
          '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
            '&:focus, &:focus-within': { outline: 'none' },
          },
          '& .MuiDataGrid-columnHeader--last .MuiDataGrid-columnSeparator--sideRight':
            {
              display: 'none',
            },
        }}
        {...props}
        rows={data ?? []}
        slots={{
          row: PeriodicReportRow,
          ...props.slots,
        }}
        columns={columns}
        onRowClick={(params, event, details) => {
          if (props.onRowClick) {
            props.onRowClick(params, event, details);
          } else {
            const report = params.row as PeriodicReportFragment;
            const file = report[fileField];
            if (!file.canRead) {
              enqueueSnackbar(
                `You don't have permission to view this report file`
              );
              return;
            }
            if (file.value) {
              openFilePreview(file.value);
              return;
            }
            if (file.canEdit) {
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
    <PeriodicReportFileFieldProvider
      fileField={props.fileField ?? 'reportFile'}
    >
      <PeriodicReportsTableInContext {...props} />
    </PeriodicReportFileFieldProvider>
  </FileActionsContextProvider>
);
