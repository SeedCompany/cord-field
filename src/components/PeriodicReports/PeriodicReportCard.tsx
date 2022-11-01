import { AssignmentOutlined, BarChart, ShowChart } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  Divider,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReportType } from '~/api/schema.graphql';
import { extendSx, Many, simpleSwitch, StyleProps } from '~/common';
import {
  EditablePeriodicReportField,
  UpdatePeriodicReportDialog,
} from '../../scenes/Projects/Reports/UpdatePeriodicReportDialog';
import { useDialog } from '../Dialog';
import {
  FileActionsContextProvider,
  useFileActions,
} from '../files/FileActions';
import { HugeIcon } from '../Icons';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { DropOverlay } from './DropOverlay';
import { SecuredPeriodicReportFragment } from './PeriodicReport.graphql';
import { ReportInfo } from './ReportInfo';
import { ReportLabel } from './ReportLabel';

const relevantReport = {
  display: 'flex',
  flexDirection: 'column',
};
export interface PeriodicReportCardProps extends StyleProps {
  type: ReportType;
  dueCurrently?: SecuredPeriodicReportFragment;
  dueNext?: SecuredPeriodicReportFragment;
  disableIcon?: boolean;
  hasDetailPage?: boolean;
}

const PeriodicReportCardInContext = (props: PeriodicReportCardProps) => {
  const { type, dueCurrently, dueNext, disableIcon, hasDetailPage } = props;

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
      <Card
        {...getRootProps()}
        tabIndex={-1}
        className={props.className}
        sx={[
          {
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            outline: 'none',
          },
          ...extendSx(props.sx),
        ]}
      >
        <CardActionAreaLink
          to={link}
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'flex-start',
            py: 3,
            px: 4,
          }}
        >
          {!disableIcon && (
            <HugeIcon
              icon={simpleSwitch(type, {
                Narrative: AssignmentOutlined,
                Financial: ShowChart,
                Progress: BarChart,
              })}
              sx={{ mr: 4 }}
            />
          )}

          <Box
            sx={{
              flex: 1,
              alignSelf: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}
          >
            <Typography variant="h4" paragraph>
              {`${type} Reports`}
            </Typography>
            <Box
              sx={{
                display: 'flex',
              }}
            >
              <ReportInfo
                title="Current"
                report={dueCurrently}
                sx={relevantReport}
              />
              <Divider
                orientation="vertical"
                flexItem
                variant="middle"
                sx={{ mx: 2 }}
              />
              <ReportInfo title="Next" report={dueNext} sx={relevantReport} />
            </Box>
          </Box>
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
