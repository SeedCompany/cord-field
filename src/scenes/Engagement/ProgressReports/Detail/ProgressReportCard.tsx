import { Tooltip } from '@material-ui/core';
import React from 'react';
import { DefinedFileCard } from '../../../../components/DefinedFileCard';
import { FileActionsContextProvider } from '../../../../components/files/FileActions';
import { UpdatePeriodicReportDocument } from '../../../../components/PeriodicReports/Upload/UpdatePeriodicReport.generated';
import { ProgressReportFragment } from './ProgressReportDetail.generated';

interface Props {
  progressReport: ProgressReportFragment;
}

export const ProgressReportCard = ({ progressReport }: Props) => {
  return (
    <FileActionsContextProvider>
      <Tooltip title="This holds the progress report files" placement="top">
        <DefinedFileCard
          label="Progress Report"
          uploadMutationDocument={UpdatePeriodicReportDocument}
          parentId={progressReport.id}
          resourceType="progressReport"
          securedFile={progressReport.reportFile}
          disableIcon
          getUploadVariables={(uploadId, name) => ({
            input: {
              id: progressReport.id,
              ...(uploadId ? { reportFile: { uploadId, name } } : {}),
            },
          })}
        />
      </Tooltip>
    </FileActionsContextProvider>
  );
};
