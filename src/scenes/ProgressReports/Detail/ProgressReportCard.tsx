import { Preview as PreviewIcon } from '@mui/icons-material';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import {
  DefinedFileCard,
  DefinedFileCardProps,
} from '../../../components/DefinedFileCard';
import {
  NonDirectoryActionItem as File,
  FileActionsContextProvider,
  useFileActions,
} from '../../../components/files/FileActions';
import { UploadPeriodicReportFileDocument } from '../../../components/PeriodicReports/Upload/UpdatePeriodicReport.graphql';
import { PnPValidationIcon } from '../PnpValidation/PnpValidationIcon';
import { ProgressReportDetailFragment } from './ProgressReportDetail.graphql';

interface Props
  extends Omit<
    DefinedFileCardProps,
    | 'label'
    | 'uploadMutationDocument'
    | 'parentId'
    | 'resourceType'
    | 'securedFile'
  > {
  progressReport: Pick<
    ProgressReportDetailFragment,
    'id' | 'reportFile' | 'pnpExtractionResult'
  >;
}

export const ProgressReportCard = ({ progressReport, ...rest }: Props) => {
  const file = progressReport.reportFile.value;
  return (
    <FileActionsContextProvider>
      <Tooltip title="This holds the progress report PnP file" placement="top">
        <DefinedFileCard
          label="PnP File"
          uploadMutationDocument={UploadPeriodicReportFileDocument}
          parentId={progressReport.id}
          resourceType="progress report"
          securedFile={progressReport.reportFile}
          header={
            <Stack
              sx={{
                mt: -1,
                flexDirection: 'row',
                gap: 1,
                alignItems: 'center',
              }}
            >
              <Typography variant="h3">PnP File</Typography>
              {file && (
                <>
                  <Preview file={file} />
                  {progressReport.pnpExtractionResult && (
                    <PnPValidationIcon
                      file={file}
                      result={progressReport.pnpExtractionResult}
                      size="small"
                    />
                  )}
                </>
              )}
            </Stack>
          }
          disableIcon
          disablePreview
          sx={{
            width: file && 'max-content',
          }}
          {...rest}
        />
      </Tooltip>
    </FileActionsContextProvider>
  );
};

const Preview = ({ file }: { file: File }) => {
  const { openFilePreview } = useFileActions();
  return (
    <Tooltip title="Preview">
      <IconButton onClick={() => openFilePreview(file)} size="small">
        <PreviewIcon />
      </IconButton>
    </Tooltip>
  );
};
