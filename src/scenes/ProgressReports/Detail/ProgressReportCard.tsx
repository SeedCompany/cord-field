import { Tooltip } from '@material-ui/core';
import React from 'react';
import {
  DefinedFileCard,
  DefinedFileCardProps,
} from '../../../components/DefinedFileCard';
import { FileActionsContextProvider } from '../../../components/files/FileActions';
import { UploadPeriodicReportFileDocument } from '../../../components/PeriodicReports/Upload/UpdatePeriodicReport.generated';
import { ProgressReportFragment } from './ProgressReportDetail.generated';

interface Props extends Pick<DefinedFileCardProps, 'onUpload' | 'disableIcon'> {
  progressReport: ProgressReportFragment;
}

export const ProgressReportCard = ({ progressReport, ...rest }: Props) => {
  return (
    <FileActionsContextProvider>
      <Tooltip title="This holds the progress report PnP file" placement="top">
        <DefinedFileCard
          label="PnP File"
          uploadMutationDocument={UploadPeriodicReportFileDocument}
          parentId={progressReport.id}
          resourceType="progress report"
          securedFile={progressReport.reportFile}
          {...rest}
        />
      </Tooltip>
    </FileActionsContextProvider>
  );
};
