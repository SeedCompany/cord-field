import { Grid, Tooltip, Typography } from '@material-ui/core';
import React from 'react';
import { DefinedFileCard } from '../../../../components/DefinedFileCard';
import { FileActionsContextProvider } from '../../../../components/files/FileActions';
import { PeriodicReportCard } from '../../../../components/PeriodicReports';
import { UploadLanguageEngagementPnpDocument } from '../../Files';
import { ProgressAndPlanningFragment } from './ProgressAndPlanning.generated';

export const ProgressAndPlanning = ({
  engagement,
}: {
  engagement: ProgressAndPlanningFragment;
}) => (
  <>
    <Grid item container>
      <Typography variant="h3" paragraph>
        Latest Report
      </Typography>
    </Grid>
    <FileActionsContextProvider>
      <Grid item container direction="column" spacing={3}>
        <Grid item container>
          <PeriodicReportCard
            type="Progress"
            dueCurrently={engagement.currentProgressReportDue}
            dueNext={engagement.nextProgressReportDue}
          />
        </Grid>
        <Grid item container>
          <Tooltip title="This holds the planning info of PnP files">
            <Grid item xs={12}>
              <DefinedFileCard
                label="Planning Spreadsheet"
                uploadMutationDocument={UploadLanguageEngagementPnpDocument}
                parentId={engagement.id}
                resourceType="engagement"
                securedFile={engagement.pnp}
              />
            </Grid>
          </Tooltip>
        </Grid>
      </Grid>
    </FileActionsContextProvider>
  </>
);
