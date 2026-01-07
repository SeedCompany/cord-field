import { useMutation } from '@apollo/client';
import { Typography } from '@mui/material';
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
import { DefinedFileCard } from '../../../../components/DefinedFileCard';
import { useDialog } from '../../../../components/Dialog';
import { DialogForm } from '../../../../components/Dialog/DialogForm';
import { FileActionsContextProvider } from '../../../../components/files/FileActions';
import { HandleUploadCompletedFunction } from '../../../../components/files/hooks';
import { EnumField, EnumOption } from '../../../../components/form';
import { UploadLanguageEngagementPnpDocument as UploadPnp } from '../../Files';
import { EngagementPlanningSpreadsheetFragment } from './PlanningSpreadsheet.graphql';
import { PlanningSpreadsheetHeader } from './PlanningSpreadsheetHeader';

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
        header={<PlanningSpreadsheetHeader engagement={engagement} />}
      />
      {upload && (
        <DialogForm<{ methodology?: Methodology }>
          {...dialogState}
          onSubmit={async ({ methodology }) => {
            upload.submit(async ({ uploadId, name }) => {
              await updateEngagement({
                variables: {
                  id: engagement.id,
                  upload: { upload: uploadId, name },
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
