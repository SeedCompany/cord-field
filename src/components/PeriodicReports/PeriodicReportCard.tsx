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
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReportType } from '../../api';
import {
  EditablePeriodicReportField,
  UpdatePeriodicReportDialog,
} from '../../scenes/Projects/Reports/UpdatePeriodicReportDialog';
import { Many, simpleSwitch } from '../../util';
import { useDialog } from '../Dialog';
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
  icon: {
    marginRight: spacing(4),
  },
  rightContent: {
    flex: 1,
    alignSelf: 'flex-start',
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
  disableIcon?: boolean;
  hasDetailPage?: boolean;
}

const PeriodicReportCardInContext = (props: PeriodicReportCardProps) => {
  const { type, dueCurrently, dueNext, disableIcon, hasDetailPage } = props;
  const classes = useStyles();

  const currentFile = dueCurrently?.value?.reportFile;
  const needsUpload =
    currentFile?.canRead && !currentFile.value && currentFile.canEdit;
  const [editState, editField, fieldsBeingEdited] =
    useDialog<Many<EditablePeriodicReportField>>();
  const [fileBeingEdited, editFile] = useState<File[]>();

  const { openFilePreview } = useFileActions();
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileBrowser,
  } = useDropzone({
    onDrop: (files) => {
      if (!currentFile?.canEdit) {
        return;
      }
      editFile(files);
      editField(['reportFile', 'receivedDate']);
    },
    noClick: true,
  });
  const link = `reports/${type.toLowerCase()}`;

  return (
    <>
      <Card {...getRootProps()} tabIndex={-1} className={classes.root}>
        <CardActionAreaLink to={link} className={classes.topArea}>
          {!disableIcon && (
            <HugeIcon
              icon={simpleSwitch(type, {
                Narrative: AssignmentOutlined,
                Financial: ShowChart,
                Progress: BarChart,
              })}
              className={classes.icon}
            />
          )}

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
            hasDetailPage ? (
              <ButtonLink
                color="primary"
                to={`${link}/${dueCurrently!.value!.id}`}
              >
                View Report
              </ButtonLink>
            ) : (
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
            )
          ) : null}
        </CardActions>
        <DropOverlay report={dueCurrently} show={isDragActive} />
        <input {...getInputProps()} name="report_file_uploader" />
      </Card>
      {dueCurrently?.value?.reportFile.canEdit && fileBeingEdited ? (
        <UpdatePeriodicReportDialog
          {...editState}
          editFields={fieldsBeingEdited}
          report={{ ...dueCurrently.value, reportFile: fileBeingEdited }}
        />
      ) : null}
    </>
  );
};

export const PeriodicReportCard = (props: PeriodicReportCardProps) => (
  <FileActionsContextProvider>
    <PeriodicReportCardInContext {...props} />
  </FileActionsContextProvider>
);
