import { useMutation } from '@apollo/client';
import { makeStyles, Tooltip, Typography } from '@material-ui/core';
import { pick } from 'lodash';
import React from 'react';
import {
  ApproachMethodologies,
  displayApproach,
  displayMethodology,
  ProductMethodology as Methodology,
} from '../../../../api';
import { DefinedFileCard } from '../../../../components/DefinedFileCard';
import { useDialog } from '../../../../components/Dialog';
import { DialogForm } from '../../../../components/Dialog/DialogForm';
import { FileActionsContextProvider } from '../../../../components/files/FileActions';
import { HandleUploadCompletedFunction } from '../../../../components/files/hooks';
import { EnumField, EnumOption } from '../../../../components/form';
import { PeriodicReportCard } from '../../../../components/PeriodicReports';
import { entries } from '../../../../util';
import { UploadLanguageEngagementPnpDocument as UploadPnp } from '../../Files';
import { ProgressAndPlanningFragment } from './ProgressAndPlanning.generated';

export const useStyles = makeStyles(({ spacing, typography }) => ({
  section: {
    '&:not(:last-child)': {
      marginBottom: spacing(2),
    },
  },
  label: {
    fontWeight: typography.weight.bold,
  },
}));

interface Props {
  engagement: ProgressAndPlanningFragment;
}

export const ProgressReports = ({ engagement }: Props) => (
  <FileActionsContextProvider>
    <PeriodicReportCard
      type="Progress"
      dueCurrently={engagement.currentProgressReportDue}
      dueNext={engagement.nextProgressReportDue}
      disableIcon
    />
  </FileActionsContextProvider>
);

export const PlanningSpreadsheet = ({ engagement }: Props) => {
  const [dialogState, setUploading, upload] =
    // Functions cannot be passed directly here so wrap in object
    useDialog<{ submit: (next: HandleUploadCompletedFunction) => void }>();
  const [updateEngagement] = useMutation(UploadPnp);
  const classes = useStyles();

  return (
    <FileActionsContextProvider>
      <Tooltip
        title="This holds the planning info of PnP files"
        placement="top"
      >
        <DefinedFileCard
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
            <div className={classes.section}>
              <EnumOption default label="Skip extracting goals" />
            </div>
            {entries({
              ...pick(ApproachMethodologies, 'Written', 'OralTranslation'),
              Visual: ['SignLanguage'] as const,
            }).map(([approach, methodologies]) => (
              <div key={approach} className={classes.section}>
                <Typography className={classes.label}>
                  {displayApproach(approach)}
                </Typography>
                {methodologies.map((option: Methodology) => (
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
