import { SkipNextRounded } from '@mui/icons-material';
import { Box, Grid, Skeleton, Typography } from '@mui/material';
import { omit } from 'lodash';
import { DateTime } from 'luxon';
import { ReactNode } from 'react';
import { CalendarDate, StyleProps } from '~/common';
import { FormattedDate, FormattedDateTime } from '../../Formatters';
import { PaperTooltip } from '../../PaperTooltip';
import { Redacted } from '../../Redacted';
import { SecuredPeriodicReportFragment } from '../PeriodicReport.graphql';
import { ReportLabel } from '../ReportLabel';

export const ReportInfo = ({
  title,
  report,
  ...rest
}: {
  title: ReactNode;
  report?: SecuredPeriodicReportFragment;
} & StyleProps) => {
  const file = report?.value?.reportFile;
  const section = (
    <Box display="flex" flexDirection="column" {...rest}>
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
          report.value.skippedReason.value &&
          !report.value.receivedDate.value ? (
            <SkippedText />
          ) : (
            <Due date={report.value.due} />
          )
        ) : null}
      </Typography>
    </Box>
  );

  return (
    <PaperTooltip
      placement="bottom"
      title={report?.value?.skippedReason.value ?? ''}
      children={section}
    />
  );
};

export const SkippedText = () => (
  <Grid container alignItems="center" justifyContent="center">
    <Typography variant="inherit">Skipped</Typography>
    <SkipNextRounded fontSize="small" />
  </Grid>
);

export const Due = ({ date }: { date: CalendarDate }) => (
  <>
    Due{' '}
    <FormattedDate
      date={date}
      displayOptions={
        date.diffNow('years').years < 1 // same year
          ? omit(DateTime.DATE_SHORT, 'year')
          : undefined
      }
    />
  </>
);
