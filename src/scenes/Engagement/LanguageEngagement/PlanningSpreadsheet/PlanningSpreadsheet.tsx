import { useMutation } from '@apollo/client';
import { Preview as PreviewIcon } from '@mui/icons-material';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { entries } from '@seedcompany/common';
import { pick } from 'lodash';
import { makeStyles } from 'tss-react/mui';
import {
  ProductMethodology as Methodology,
  ProductApproachLabels,
} from '~/api/schema.graphql';
import {
  ApproachMethodologies,
  displayMethodology,
  StyleProps,
} from '~/common';
import { Feature } from '~/components/Feature';
import { DefinedFileCard } from '../../../../components/DefinedFileCard';
import { useDialog } from '../../../../components/Dialog';
import { DialogForm } from '../../../../components/Dialog/DialogForm';
import {
  NonDirectoryActionItem as File,
  FileActionsContextProvider,
  useFileActions,
} from '../../../../components/files/FileActions';
import { HandleUploadCompletedFunction } from '../../../../components/files/hooks';
import { EnumField, EnumOption } from '../../../../components/form';
import { PnPValidationIcon } from '../../../ProgressReports/PnpValidation/PnpValidationIcon';
import { UploadLanguageEngagementPnpDocument as UploadPnp } from '../../Files';
import { EngagementPlanningSpreadsheetFragment } from './PlanningSpreadsheet.graphql';

const useStyles = makeStyles()(({ spacing, typography }) => ({
  section: {
    '&:not(:last-child)': {
      marginBottom: spacing(2),
    },
  },
  label: {
    fontWeight: typography.weight.bold,
  },
}));

interface Props extends StyleProps {
  engagement: EngagementPlanningSpreadsheetFragment;
}

export const PlanningSpreadsheet = ({ engagement, ...rest }: Props) => {
  const [dialogState, setUploading, upload] =
    // Functions cannot be passed directly here so wrap in object
    useDialog<{ submit: (next: HandleUploadCompletedFunction) => void }>();
  const [updateEngagement] = useMutation(UploadPnp);
  const { classes } = useStyles();

  return (
    <FileActionsContextProvider>
      {/* <Tooltip title="This holds the planning info of PnP files" placement="top"> */}
      <DefinedFileCard
        {...rest}
        label="Planning Spreadsheet"
        uploadMutationDocument={UploadPnp}
        parentId={engagement.id}
        resourceType="engagement"
        securedFile={engagement.pnp}
        disableIcon
        disablePreview={true}
        onUpload={setUploading}
        header={
          <Stack
            sx={{
              mt: -1,
              flexDirection: 'row',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">Planning Spreadsheet</Typography>
            {engagement.pnp.value && (
              <>
                <Preview file={engagement.pnp.value} />
                <Feature
                  flag="pnp-validation"
                  match={true}
                  sx={{
                    display: 'inherit',
                    flexDirection: 'inherit',
                    gap: 'inherit',
                  }}
                >
                  {engagement.pnpExtractionResult && (
                    <PnPValidationIcon
                      file={engagement.pnp.value}
                      result={engagement.pnpExtractionResult}
                      engagement={engagement}
                      size="small"
                    />
                  )}
                </Feature>
              </>
            )}
          </Stack>
        }
      />
      {upload && (
        <DialogForm<{ methodology?: Methodology }>
          {...dialogState}
          onSubmit={async ({ methodology }) => {
            upload.submit(async ({ uploadId, name }) => {
              await updateEngagement({
                variables: {
                  id: engagement.id,
                  upload: { uploadId, name },
                  methodology,
                },
              });
            });
          }}
          title="Extract Goals?"
          submitLabel="Upload"
          sendIfClean // Default option leaves form clean, but we want to send it
        >
          <Typography>
            CORD can create goals from this spreadsheet for you. We just need to
            know which methodology the new goals should have.
          </Typography>
          <EnumField name="methodology" layout="column" helperText={false}>
            <div className={classes.section}>
              <EnumOption default label="Skip extracting goals" />
            </div>
            {entries({
              ...pick(
                ApproachMethodologies,
                'Written',
                'OralTranslation',
                'OralStories'
              ),
              Visual: ['SignLanguage'] as const,
            }).map(([approach, methodologies]) => (
              <div key={approach} className={classes.section}>
                <Typography className={classes.label}>
                  {ProductApproachLabels[approach]}
                </Typography>
                {methodologies.map((option) => (
                  <EnumOption
                    key={option}
                    label={displayMethodology(option)}
                    value={option}
                  />
                ))}
              </div>
            ))}
          </EnumField>
        </DialogForm>
      )}
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
