import { SkipNextRounded } from '@mui/icons-material';
import { Box, Grid, Skeleton, Typography } from '@mui/material';
import { omit } from 'lodash';
import { DateTime } from 'luxon';
import { ReactNode } from 'react';
import { StyleProps } from '~/common';
import { FormattedDate, FormattedDateTime } from '../Formatters';
import { PaperTooltip } from '../PaperTooltip';
import { Redacted } from '../Redacted';
import { SecuredPeriodicReportFragment } from './PeriodicReport.graphql';
import { ReportLabel } from './ReportLabel';

interface ReportInfoProps extends StyleProps {
  title: ReactNode;
  report?: SecuredPeriodicReportFragment;
}

export const ReportInfo = ({
  title,
  report,
  className,
  sx,
}: ReportInfoProps) => {
  const file = report?.value?.reportFile;
  const section = (
    <Box className={className} sx={sx}>
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
        sx={{
          whiteSpace: 'nowrap',
        }}
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
