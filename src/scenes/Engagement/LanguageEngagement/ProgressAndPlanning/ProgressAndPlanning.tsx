import { Tooltip } from '@material-ui/core';
import React from 'react';
import { DefinedFileCard } from '../../../../components/DefinedFileCard';
import { FileActionsContextProvider } from '../../../../components/files/FileActions';
import { PeriodicReportCard } from '../../../../components/PeriodicReports';
import { UploadLanguageEngagementPnpDocument } from '../../Files';
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

export const PlanningSpreadsheet = ({ engagement }: Props) => (
  <FileActionsContextProvider>
    <Tooltip title="This holds the planning info of PnP files" placement="top">
      <DefinedFileCard
        label="Planning Spreadsheet"
        uploadMutationDocument={UploadLanguageEngagementPnpDocument}
        parentId={engagement.id}
        resourceType="engagement"
        securedFile={engagement.pnp}
        disableIcon
      />
    </Tooltip>
  </FileActionsContextProvider>
);
