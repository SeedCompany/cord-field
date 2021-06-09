import { Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { ReactNode } from 'react';
import { FormattedDate, FormattedDateTime } from '../Formatters';
import { Redacted } from '../Redacted';
import { SecuredPeriodicReportFragment } from './PeriodicReport.generated';
import { ReportLabel } from './ReportLabel';

export const ReportInfo = ({
  title,
  report,
  className,
}: {
  title: ReactNode;
  report?: SecuredPeriodicReportFragment;
  className?: string;
}) => {
  const file = report?.value?.reportFile;
  return (
    <div className={className}>
      <Typography
        variant="body2"
        display="inline"
        color="textSecondary"
        gutterBottom
      >
        {title}
      </Typography>
      <Typography variant="h4" display="inline" gutterBottom>
        {!report ? (
          <Skeleton />
        ) : report.canRead && !report.value ? (
          'None'
        ) : (
          <ReportLabel report={report} />
        )}
      </Typography>
      <Typography
        display="inline"
        variant={file ? 'caption' : 'body2'}
        color={file ? 'textSecondary' : undefined}
      >
        {!report ? (
          <Skeleton />
        ) : file && !file.canRead ? (
          <Redacted info="You cannot view this report's file" />
        ) : file?.value ? (
          <>
            Uploaded by {file.value.modifiedBy.fullName}
            <br />
            at <FormattedDateTime date={file.value.modifiedAt} />
          </>
        ) : report.value ? (
          <>
            Due{' '}
            <FormattedDate
              date={report.value.due}
              displayOptions={{ day: 'numeric', month: 'numeric' }}
            />
          </>
        ) : null}
      </Typography>
    </div>
  );
};
