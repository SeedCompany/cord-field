import { Grid, makeStyles, Typography } from '@material-ui/core';
import { SkipNextRounded } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { omit } from 'lodash';
import { DateTime } from 'luxon';
import React, { ReactNode } from 'react';
import { FormattedDate, FormattedDateTime } from '../Formatters';
import { PaperTooltip } from '../PaperTooltip';
import { Redacted } from '../Redacted';
import { SecuredPeriodicReportFragment } from './PeriodicReport.graphql';
import { ReportLabel } from './ReportLabel';

const useStyles = makeStyles(() => ({
  label: {
    whiteSpace: 'nowrap',
  },
}));

export const ReportInfo = ({
  title,
  report,
  className,
}: {
  title: ReactNode;
  report?: SecuredPeriodicReportFragment;
  className?: string;
}) => {
  const classes = useStyles();

  const file = report?.value?.reportFile;
  const section = (
    <div className={className}>
      <Typography
        variant="body2"
        display="inline"
        color="textSecondary"
        gutterBottom
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        display="inline"
        gutterBottom
        className={classes.label}
      >
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
          report.value.skippedReason.value &&
          !report.value.receivedDate.value ? (
            <Grid container alignItems="center">
              <Typography variant="inherit">Skipped</Typography>
              <SkipNextRounded fontSize="small" />
            </Grid>
          ) : (
            <>
              Due{' '}
              <FormattedDate
                date={report.value.due}
                displayOptions={
                  report.value.due.diffNow('years').years < 1 // same year
                    ? omit(DateTime.DATE_SHORT, 'year')
                    : undefined
                }
              />
            </>
          )
        ) : null}
      </Typography>
    </div>
  );

  return (
    <PaperTooltip
      placement="bottom"
      title={report?.value?.skippedReason.value ?? ''}
      children={section}
    />
  );
};
