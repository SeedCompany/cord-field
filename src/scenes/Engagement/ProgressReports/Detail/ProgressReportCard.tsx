import { Tooltip } from '@material-ui/core';
import React from 'react';
import { DefinedFileCard } from '../../../../components/DefinedFileCard';
import { FileActionsContextProvider } from '../../../../components/files/FileActions';
import { UploadPeriodicReportFileDocument } from '../../../../components/PeriodicReports/Upload/UpdatePeriodicReport.generated';
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
          uploadMutationDocument={UploadPeriodicReportFileDocument}
          parentId={progressReport.id}
          resourceType="progressReport"
          securedFile={progressReport.reportFile}
          disableIcon
        />
      </Tooltip>
    </FileActionsContextProvider>
  );
};
