import { useMutation } from '@apollo/client';
import { Box, Tooltip, Typography } from '@mui/material';
import { pick } from 'lodash';
import {
  ProductMethodology as Methodology,
  ProductApproachLabels,
} from '~/api/schema.graphql';
import {
  ApproachMethodologies,
  displayMethodology,
  entries,
  StyleProps,
} from '~/common';
import { DefinedFileCard } from '../../../../components/DefinedFileCard';
import { useDialog } from '../../../../components/Dialog';
import { DialogForm } from '../../../../components/Dialog/DialogForm';
import { FileActionsContextProvider } from '../../../../components/files/FileActions';
import { HandleUploadCompletedFunction } from '../../../../components/files/hooks';
import { EnumField, EnumOption } from '../../../../components/form';
import { PeriodicReportCard } from '../../../../components/PeriodicReports';
import { UploadLanguageEngagementPnpDocument as UploadPnp } from '../../Files';
import { ProgressAndPlanningFragment } from './ProgressAndPlanning.graphql';

interface Props extends StyleProps {
  engagement: ProgressAndPlanningFragment;
}

export const ProgressReports = ({ engagement, ...rest }: Props) => (
  <PeriodicReportCard
    {...rest}
    type="Progress"
    dueCurrently={engagement.currentProgressReportDue}
    dueNext={engagement.nextProgressReportDue}
    disableIcon
    hasDetailPage
  />
);

export const PlanningSpreadsheet = ({ engagement, ...rest }: Props) => {
  const [dialogState, setUploading, upload] =
    // Functions cannot be passed directly here so wrap in object
    useDialog<{ submit: (next: HandleUploadCompletedFunction) => void }>();
  const [updateEngagement] = useMutation(UploadPnp);

  return (
    <FileActionsContextProvider>
      <Tooltip
        title="This holds the planning info of PnP files"
        placement="top"
      >
        <DefinedFileCard
          {...rest}
          label="Planning Spreadsheet"
          uploadMutationDocument={UploadPnp}
          parentId={engagement.id}
          resourceType="engagement"
          securedFile={engagement.pnp}
          disableIcon
          onUpload={setUploading}
        />
      </Tooltip>
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
            <Box
              sx={{
                '&:not(:last-child)': {
                  mb: 2,
                },
              }}
            >
              <EnumOption default label="Skip extracting goals" />
            </Box>
            {entries({
              ...pick(
                ApproachMethodologies,
                'Written',
                'OralTranslation',
                'OralStories'
              ),
              Visual: ['SignLanguage'] as const,
            }).map(([approach, methodologies]) => (
              <Box
                key={approach}
                sx={{
                  '&:not(:last-child)': {
                    mb: 2,
                  },
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>
                  {ProductApproachLabels[approach]}
                </Typography>
                {methodologies.map((option: Methodology) => (
                  <EnumOption
                    key={option}
                    label={displayMethodology(option)}
                    value={option}
                  />
                ))}
              </Box>
            ))}
          </EnumField>
        </DialogForm>
      )}
    </FileActionsContextProvider>
  );
};
