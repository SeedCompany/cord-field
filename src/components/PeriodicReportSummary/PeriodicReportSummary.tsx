import { makeStyles } from '@material-ui/core';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { PeriodType } from '../../api';
import { CalendarDate } from '../../util';
import {
  FileAction,
  FileActionsContextProvider,
  FileActionsPopup,
  getPermittedFileActions,
} from '../files/FileActions';
import { useDownloadFile } from '../files/hooks';
import { PeriodicReportFragment } from './PeriodicReport.generated';
import { PeriodicReportCard } from './PeriodicReportCard';
import { useUploadPeriodicReport } from './useUploadPeriodicReport';

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
    height: '100%',
    display: 'flex',
    position: 'relative',
    outline: 'none',
  },
  actionsMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

export interface PeriodicReportSummaryProps {
  currentReportDue?: PeriodicReportFragment;
  nextReportDue?: PeriodicReportFragment;
  period?: PeriodType;
  loading?: boolean;
  total?: number;
}

export const PeriodicReportSummary: FC<PeriodicReportSummaryProps> = ({
  currentReportDue,
  nextReportDue,
  period,
  loading,
  total,
}) => {
  const classes = useStyles();
  const uploadPeriodicReport = useUploadPeriodicReport();

  const downloadFile = useDownloadFile();

  const onVersionUpload = (files: File[]) => {
    if (currentReportDue) {
      uploadPeriodicReport({ files, parentId: currentReportDue.id });
    }
  };

  const {
    getRootProps,
    getInputProps,
    open: openFileBrowser,
  } = useDropzone({
    onDrop: onVersionUpload,
    noClick: true,
  });

  const title =
    currentReportDue?.type === 'Financial'
      ? 'Financial Report'
      : currentReportDue?.type === 'Narrative'
      ? 'Narrative Report'
      : currentReportDue?.type === 'Progress'
      ? 'Planning and Progress'
      : '';

  const reportFile = currentReportDue?.reportFile;
  const standardFileActions = reportFile
    ? getPermittedFileActions(reportFile.canRead, reportFile.canEdit)
    : [];
  const noRenameFileActions = standardFileActions.filter(
    (action) => action !== FileAction.Rename
  );
  const permittedFileActions = {
    // We only want to allow deletion of Defined File `Versions`,
    // not the files themselves.
    file: noRenameFileActions.filter((action) => action !== FileAction.Delete),
    version: noRenameFileActions,
  };

  const uploadOrDownloadReportFile = () => {
    if (reportFile?.value) {
      void downloadFile(reportFile.value);
    } else {
      openFileBrowser();
    }
  };

  const actionLink = currentReportDue
    ? currentReportDue.type === 'Progress'
      ? 'reports'
      : `reports/${currentReportDue.type.toLowerCase()}`
    : '';

  const calculateDueDateOneMonthAfter = (date?: CalendarDate) =>
    date?.plus({ month: 1 }).endOf('month');

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} name="report_file_uploader" />

      <PeriodicReportCard
        title={title}
        link={actionLink}
        loading={loading}
        period={period || 'Quarterly'}
        dueDate={calculateDueDateOneMonthAfter(currentReportDue?.end)}
        nextDueDate={calculateDueDateOneMonthAfter(nextReportDue?.end)}
        createdBy={reportFile?.value?.createdBy.fullName || ''}
        modifiedAt={reportFile?.value?.modifiedAt}
        total={total}
        onFileActionClick={uploadOrDownloadReportFile}
      />

      <FileActionsContextProvider>
        <div className={classes.actionsMenu}>
          {reportFile?.value && (
            <FileActionsPopup
              actions={permittedFileActions}
              item={reportFile.value}
              onVersionUpload={onVersionUpload}
            />
          )}
        </div>
      </FileActionsContextProvider>
    </div>
  );
};
