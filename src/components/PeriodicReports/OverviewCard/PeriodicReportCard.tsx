import { AssignmentOutlined, BarChart, ShowChart } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReportType } from '~/api/schema.graphql';
import {
  extendSx,
  gridTemplateAreas,
  Many,
  SecuredProp,
  simpleSwitch,
  StyleProps,
} from '~/common';
import {
  EditablePeriodicReportField,
  UpdatePeriodicReportDialog,
} from '../../../scenes/Projects/Reports/UpdatePeriodicReportDialog';
import { useDialog } from '../../Dialog';
import {
  FileActionsContextProvider,
  useFileActions,
} from '../../files/FileActions';
import { HugeIcon } from '../../Icons';
import {
  ButtonLink,
  CardActionAreaLink,
  CardActionAreaLinkProps,
} from '../../Routing';
import { PeriodicReportFragment } from '../PeriodicReport.graphql';
import { ReportLabel } from '../ReportLabel';
import { DropOverlay } from './DropOverlay';
import { ReportInfo } from './ReportInfo';
import { ReportInfoContainer } from './ReportInfoContainer';

export interface PeriodicReportCardProps extends StyleProps {
  type: ReportType;
  dueCurrently?: SecuredProp<PeriodicReportFragment>;
  dueNext?: SecuredProp<PeriodicReportFragment>;
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
      <PeriodicReportCardRoot
        {...getRootProps()}
        tabIndex={-1}
        className={props.className}
        sx={props.sx}
      >
        <PeriodicReportCardContent to={link} icon={!disableIcon}>
          {!disableIcon && (
            <HugeIcon
              icon={simpleSwitch(type, {
                Narrative: AssignmentOutlined,
                Financial: ShowChart,
                Progress: BarChart,
              })}
              sx={{ gridArea: 'icon' }}
            />
          )}

          <Typography variant="h4" sx={{ gridArea: 'title' }}>
            {`${type} Reports`}
          </Typography>
          <ReportInfoContainer
            horizontalAt={260}
            spaceEvenlyAt={400}
            sx={{ gridArea: 'info' }}
          >
            <ReportInfo title="Current" report={dueCurrently} />
            <ReportInfo title="Next" report={dueNext} />
          </ReportInfoContainer>
        </PeriodicReportCardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
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
          ) : (
            <Box flex={1} />
          )}
          <ButtonLink color="primary" to={link}>
            All Reports
          </ButtonLink>
        </CardActions>
        <DropOverlay report={dueCurrently} show={isDragActive} />
        <input {...getInputProps()} name="report_file_uploader" />
      </PeriodicReportCardRoot>
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

const PeriodicReportCardRoot = styled(Card)({
  flex: 1,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  outline: 'none',
  containerType: 'inline-size',
});

const PeriodicReportCardContent = ({
  icon,
  ...props
}: CardActionAreaLinkProps & { icon: boolean }) => (
  <CardActionAreaLink
    {...props}
    sx={[
      {
        flex: 1,
        py: 3,
        px: 4,
        display: 'grid',
        gap: 3,
        gridTemplateColumns: 'min-content 1fr',
        ...gridTemplateAreas`
          title title
          info info
        `,
        ...(icon && {
          ...gridTemplateAreas`
            icon title
            info info
          `,
          [`@container (min-width: 430px)`]: {
            ...gridTemplateAreas`
              icon title
              icon info
            `,
            '.MuiAvatar-root': { alignSelf: 'start' },
          },
        }),
      },
      ...extendSx(props.sx),
    ]}
  />
);

export const PeriodicReportCard = (props: PeriodicReportCardProps) => (
  <FileActionsContextProvider>
    <PeriodicReportCardInContext {...props} />
  </FileActionsContextProvider>
);
