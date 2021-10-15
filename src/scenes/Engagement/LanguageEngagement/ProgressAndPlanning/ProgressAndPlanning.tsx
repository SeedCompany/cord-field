import { useMutation } from '@apollo/client';
import { Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import {
  displayMethodologyWithLabel,
  ProductMethodology as Methodology,
} from '../../../../api';
import { DefinedFileCard } from '../../../../components/DefinedFileCard';
import { useDialog } from '../../../../components/Dialog';
import { DialogForm } from '../../../../components/Dialog/DialogForm';
import { FileActionsContextProvider } from '../../../../components/files/FileActions';
import { HandleUploadCompletedFunction } from '../../../../components/files/hooks';
import { EnumField } from '../../../../components/form';
import { PeriodicReportCard } from '../../../../components/PeriodicReports';
import { UploadLanguageEngagementPnpDocument as UploadPnp } from '../../Files';
import { ProgressAndPlanningFragment } from './ProgressAndPlanning.generated';

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
        >
          <Typography>
            CORD can create goals from this spreadsheet for you. We just need to
            know which methodology the new goals should have.
          </Typography>
          <EnumField
            name="methodology"
            options={MethodologyOptions}
            getLabel={displayMethodologyWithLabel}
            layout="column"
            defaultOption="Skip extracting goals"
          />
        </DialogForm>
      )}
    </FileActionsContextProvider>
  );
};

// Only methodologies that have available steps matching pnp columns
const MethodologyOptions: Methodology[] = ['Paratext', 'OtherWritten'];
