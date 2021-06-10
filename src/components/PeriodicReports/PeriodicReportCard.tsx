import {
  Button,
  Card,
  CardActions,
  Divider,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { AssignmentOutlined, BarChart, ShowChart } from '@material-ui/icons';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { ReportType } from '../../api';
import { simpleSwitch } from '../../util';
import {
  FileActionsContextProvider,
  useFileActions,
} from '../files/FileActions';
import { HugeIcon } from '../Icons';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { DropOverlay } from './DropOverlay';
import { SecuredPeriodicReportFragment } from './PeriodicReport.generated';
import { ReportInfo } from './ReportInfo';
import { ReportLabel } from './ReportLabel';
import { useUploadPeriodicReport } from './Upload/useUploadPeriodicReport';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    outline: 'none',
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
  relevantReports: {
    display: 'flex',
  },
  relevantReport: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export interface PeriodicReportCardProps {
  type: ReportType;
  dueCurrently?: SecuredPeriodicReportFragment;
  dueNext?: SecuredPeriodicReportFragment;
}

const PeriodicReportCardInContext = ({
  type,
  dueCurrently,
  dueNext,
}: PeriodicReportCardProps) => {
  const classes = useStyles();

  const currentFile = dueCurrently?.value?.reportFile;
  const needsUpload =
    currentFile?.canRead && !currentFile.value && currentFile.canEdit;

  const uploadPeriodicReport = useUploadPeriodicReport(dueCurrently?.value?.id);
  const { openFilePreview } = useFileActions();
  const {
    getRootProps,
    getInputProps,
    open: openFileBrowser,
    isDragActive,
  } = useDropzone({
    onDrop: (files) => {
      if (!currentFile?.canEdit) {
        return;
      }
      uploadPeriodicReport(files);
    },
    noClick: true,
  });
  const link = `reports/${type.toLowerCase()}`;

  return (
    <Card {...getRootProps()} tabIndex={-1} className={classes.root}>
      <CardActionAreaLink to={link} className={classes.topArea}>
        <HugeIcon
          icon={simpleSwitch(type, {
            Narrative: AssignmentOutlined,
            Financial: ShowChart,
            Progress: BarChart,
          })}
        />

        <div className={classes.rightContent}>
          <Typography color="initial" variant="h4" paragraph>
            {`${type} Reports`}
          </Typography>
          <div className={classes.relevantReports}>
            <ReportInfo
              title="Current"
              report={dueCurrently}
              className={classes.relevantReport}
            />
            <Divider orientation="vertical" flexItem variant="middle" />
            <ReportInfo
              title="Next"
              report={dueNext}
              className={classes.relevantReport}
            />
          </div>
        </div>
      </CardActionAreaLink>
      <CardActions>
        <ButtonLink color="primary" to={link}>
          View Reports
        </ButtonLink>
        {needsUpload ? (
          <Tooltip
            title={
              <>
                Upload report for <ReportLabel report={dueCurrently} />
              </>
            }
          >
            <Button color="primary" onClick={openFileBrowser}>
              Upload Report
            </Button>
          </Tooltip>
        ) : currentFile?.value ? (
          <Tooltip
            title={
              <>
                Preview report for <ReportLabel report={dueCurrently} />
              </>
            }
          >
            <Button
              color="primary"
              onClick={() => openFilePreview(currentFile.value!)}
            >
              Preview Report
            </Button>
          </Tooltip>
        ) : null}
      </CardActions>
      <DropOverlay report={dueCurrently} show={isDragActive} />
      <input {...getInputProps()} name="report_file_uploader" />
    </Card>
  );
};

export const PeriodicReportCard = (props: PeriodicReportCardProps) => (
  <FileActionsContextProvider>
    <PeriodicReportCardInContext {...props} />
  </FileActionsContextProvider>
);
