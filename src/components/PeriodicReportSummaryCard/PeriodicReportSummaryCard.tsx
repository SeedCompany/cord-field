import { Button, Card, makeStyles, Typography } from '@material-ui/core';
import { GetAppSharp, PublishSharp } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React, { FC, MouseEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReportType, SecuredReportPeriod } from '../../api';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  FileActionsContextProvider,
  getPermittedFileActions,
} from '../files/FileActions';
import { useDownloadFile } from '../files/hooks';
import {
  useDateFormatter,
  useDateTimeFormatter,
  useFiscalMonthFormater,
  useFiscalQuarterFormater,
} from '../Formatters';
import { HugeIcon } from '../Icons';
import { NarrativeReportIcon } from '../Icons/NarrativeReportIcon';
import { CardActionAreaLink } from '../Routing';
import { PeriodicReportFragment } from './PeriodicReport.generated';
import { useUploadPeriodicReport } from './useUploadPeriodicReport';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    flex: 1,
    height: '100%',
    display: 'flex',
    position: 'relative',
  },
  topArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    padding: spacing(3, 4),
  },
  rightContent: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingLeft: spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  title: {
    marginBottom: spacing(2.5),
  },
  reportPeriod: {
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: spacing(1),
  },
  reportDue: {
    fontSize: '12px',
    lineHeight: '16px',
  },
  grayText: {
    color: palette.text.secondary,
  },
  fileBtn: {
    maxWidth: '118px',
    paddingLeft: spacing(0),
    paddingRight: spacing(0),
    display: 'inline-flex',
    justifyContent: 'flex-start',
    marginTop: spacing(1),
    marginBottom: spacing(2.5),
  },
  reportsCount: {
    fontSize: '8px',
    lineHeight: '16px',
    color: palette.text.secondary,
    marginTop: spacing(1.5),
  },
  actionsMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

export interface PeriodicReportSummaryCardProps {
  report?: PeriodicReportFragment;
  reportType: ReportType;
  reportPeriod?: SecuredReportPeriod;
  loading?: boolean;
  total?: number;
}

export const PeriodicReportSummaryCard: FC<PeriodicReportSummaryCardProps> = ({
  report,
  reportType,
  reportPeriod,
  loading,
  total,
}) => {
  const classes = useStyles();
  const dateFormatter = useDateFormatter();
  const dateTimeFormatter = useDateTimeFormatter();
  const fiscalQuarterFormatter = useFiscalQuarterFormater();
  const fiscalMonthFormatter = useFiscalMonthFormater();
  const uploadPeriodicReport = useUploadPeriodicReport();

  const downloadFile = useDownloadFile();

  const onVersionUpload = (files: File[]) => {
    uploadPeriodicReport({ files, parentId: report!.id });
  };

  const { getRootProps, getInputProps, open: openFileBrowser } = useDropzone({
    onDrop: onVersionUpload,
    noClick: true,
  });

  const Icon = NarrativeReportIcon; // Fix me - should be different icon per report type
  const title =
    reportType === 'Financial'
      ? 'Financial Report'
      : reportType === 'Narrative'
      ? 'Narrative Report'
      : 'Planning and Progress';

  const reportFile = report?.reportFile.value;
  const standardFileActions = !report?.reportFile
    ? []
    : getPermittedFileActions(
        report.reportFile.canRead,
        report.reportFile.canEdit
      );
  const noRenameFileActions = standardFileActions.filter(
    (action) => action !== FileAction.Rename
  );
  const permittedFileActions = {
    // We only want to allow deletion of Defined File `Versions`,
    // not the files themselves.
    file: noRenameFileActions.filter((action) => action !== FileAction.Delete),
    version: noRenameFileActions,
  };

  const uploadOrDownloadReportFile = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (reportFile) {
      void downloadFile(reportFile);
    } else {
      openFileBrowser();
    }
  };

  const isFetching = loading && !!total;

  return (
    <Card className={classes.root} {...getRootProps()}>
      <input {...getInputProps()} name="report_file_uploader" />

      <CardActionAreaLink
        to={
          reportType === 'Progress'
            ? 'reports'
            : `reports/${reportType.toLowerCase()}`
        }
        disabled={!report}
        className={classes.topArea}
      >
        <HugeIcon icon={Icon} loading={isFetching} />

        <div className={classes.rightContent}>
          <Typography color="initial" variant="h4" className={classes.title}>
            {isFetching ? <Skeleton width="80%" /> : title}
          </Typography>
          <Typography
            color="initial"
            variant="h5"
            className={classes.reportPeriod}
          >
            {isFetching ? (
              <Skeleton animation="pulse" />
            ) : reportPeriod?.value === 'Monthly' ? (
              fiscalMonthFormatter(report?.start)
            ) : (
              fiscalQuarterFormatter(report?.start)
            )}
          </Typography>
          <Typography
            color="initial"
            variant="h6"
            className={clsx(
              classes.reportDue,
              reportFile ? classes.grayText : undefined
            )}
          >
            {isFetching ? (
              <Skeleton animation="pulse" />
            ) : reportFile ? (
              <>
                <span>Uploaded by {reportFile.createdBy.fullName}</span>
                <br />
                <span>{dateTimeFormatter(reportFile.modifiedAt)}</span>
              </>
            ) : report ? (
              `Report Due ${dateFormatter(report.end)}`
            ) : (
              'No Report Available'
            )}
          </Typography>
          <Button
            color="primary"
            className={classes.fileBtn}
            startIcon={
              loading ? null : report?.reportFile.value ? (
                <GetAppSharp />
              ) : (
                <PublishSharp />
              )
            }
            onClick={uploadOrDownloadReportFile}
          >
            {isFetching ? (
              <Skeleton width="100%" />
            ) : report?.reportFile.value ? (
              'Download File'
            ) : (
              report && 'Upload File'
            )}
          </Button>
          <Typography
            color="initial"
            variant="h6"
            className={classes.reportDue}
          >
            {isFetching ? (
              <Skeleton animation="pulse" />
            ) : (
              report && 'Next Report Due 00-00-000'
            )}
          </Typography>
          <Typography
            color="initial"
            variant="h6"
            className={classes.reportsCount}
          >
            {isFetching ? <Skeleton animation="pulse" /> : total! > 0 && total}
          </Typography>
        </div>
      </CardActionAreaLink>

      <FileActionsContextProvider>
        <div className={classes.actionsMenu}>
          {reportFile && (
            <ActionsMenu
              actions={permittedFileActions}
              item={reportFile}
              onVersionUpload={onVersionUpload}
            />
          )}
        </div>
      </FileActionsContextProvider>
    </Card>
  );
};
