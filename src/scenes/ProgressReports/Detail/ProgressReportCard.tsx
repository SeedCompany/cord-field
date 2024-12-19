import { useMutation } from '@apollo/client';
import { Preview as PreviewIcon } from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
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
import { PnPReextractIconButton } from '../PnpValidation/PnPReextractIconButton';
import { PnPValidationIcon } from '../PnpValidation/PnpValidationIcon';
import { ReextractPnpProgressDocument } from '../PnpValidation/ReextractProgress.graphql';
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
  > & { parent: { id: string } };
}

export const ProgressReportCard = ({ progressReport, ...rest }: Props) => {
  const file = progressReport.reportFile.value;

  const [reextract, { loading: reextracting }] = useMutation(
    ReextractPnpProgressDocument,
    {
      variables: { reportId: progressReport.id },
      update: (cache, result) => {
        cache.modify({
          id: cache.identify(progressReport),
          fields: {
            pnpExtractionResult: () => result.data?.reextractPnpProgress,
          },
        });
      },
    }
  );

  return (
    <FileActionsContextProvider>
      {/*<Tooltip title="This holds the progress report PnP file" placement="top">*/}
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      <>
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
                  {reextracting ? (
                    <CircularProgress size={15} sx={{ ml: 1.1 }} />
                  ) : (
                    <PnPReextractIconButton
                      size="small"
                      onClick={() => void reextract()}
                    />
                  )}
                  {progressReport.pnpExtractionResult && !reextracting && (
                    <PnPValidationIcon
                      file={file}
                      result={progressReport.pnpExtractionResult}
                      engagement={progressReport.parent}
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
      </>
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
