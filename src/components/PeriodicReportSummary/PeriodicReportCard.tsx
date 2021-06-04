import { Button, Card, makeStyles, Typography } from '@material-ui/core';
import { GetAppSharp, PublishSharp } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React, { FC, MouseEvent } from 'react';
import { PeriodType } from '../../api';
import { CalendarDate } from '../../util';
import {
  useDateFormatter,
  useDateTimeFormatter,
  useFiscalMonthFormater,
  useFiscalQuarterFormater,
} from '../Formatters';
import { HugeIcon } from '../Icons';
import { NarrativeReportIcon } from '../Icons/NarrativeReportIcon';
import { CardActionAreaLink } from '../Routing';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    flex: 1,
    height: '100%',
    display: 'flex',
    position: 'relative',
    outline: 'none',
  },
  topArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    padding: spacing(3, 4),
  },
  rightContent: {
    flex: 1,
    alignSelf: 'flex-start',
    paddingLeft: spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  title: {
    marginBottom: spacing(2.5),
  },
  reportPeriod: {
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: spacing(1),
  },
  reportDue: {
    fontSize: '12px',
    lineHeight: '16px',
  },
  grayText: {
    color: palette.text.secondary,
  },
  fileBtn: {
    maxWidth: '118px',
    paddingLeft: spacing(0),
    paddingRight: spacing(0),
    display: 'inline-flex',
    justifyContent: 'flex-start',
    marginTop: spacing(1),
    marginBottom: spacing(2.5),
  },
  reportsCount: {
    fontSize: '8px',
    lineHeight: '16px',
    color: palette.text.secondary,
    marginTop: spacing(1.5),
  },
  actionsMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

export interface PeriodicReportCardProps {
  dueDate?: CalendarDate;
  nextDueDate?: CalendarDate;
  link: string;
  period: PeriodType;
  loading?: boolean;
  title: string;
  createdBy?: string;
  modifiedAt?: CalendarDate;
  total?: number;
  onFileActionClick: () => void;
}

export const PeriodicReportCard: FC<PeriodicReportCardProps> = ({
  dueDate,
  nextDueDate,
  period,
  link,
  loading,
  title,
  createdBy,
  modifiedAt,
  total,
  onFileActionClick,
}) => {
  const classes = useStyles();
  const dateFormatter = useDateFormatter();
  const dateTimeFormatter = useDateTimeFormatter();
  const fiscalQuarterFormatter = useFiscalQuarterFormater();
  const fiscalMonthFormatter = useFiscalMonthFormater();

  const Icon = NarrativeReportIcon; // Fix me - should be different icon per report type

  const onFileButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onFileActionClick();
  };

  return (
    <Card className={classes.root}>
      <CardActionAreaLink
        to={link}
        disabled={!link}
        className={classes.topArea}
      >
        <HugeIcon icon={Icon} loading={loading} />

        <div className={classes.rightContent}>
          <Typography color="initial" variant="h4" className={classes.title}>
            {loading ? <Skeleton width="80%" /> : title}
          </Typography>
          <Typography
            color="initial"
            variant="h5"
            className={classes.reportPeriod}
          >
            {loading ? (
              <Skeleton animation="pulse" />
            ) : period === 'Monthly' ? (
              fiscalMonthFormatter(dueDate)
            ) : (
              fiscalQuarterFormatter(dueDate)
            )}
          </Typography>
          <Typography
            color="initial"
            variant="h6"
            className={clsx(
              classes.reportDue,
              createdBy ? classes.grayText : undefined
            )}
          >
            {loading ? (
              <Skeleton animation="pulse" />
            ) : createdBy ? (
              <>
                <span>Uploaded by {createdBy}</span>
                <br />
                <span>{dateTimeFormatter(modifiedAt)}</span>
              </>
            ) : dueDate ? (
              `Report Due ${dateFormatter(dueDate)}`
            ) : (
              'No Report Available'
            )}
          </Typography>
          <Button
            color="primary"
            className={classes.fileBtn}
            startIcon={
              loading || !dueDate ? null : createdBy ? (
                <GetAppSharp />
              ) : (
                <PublishSharp />
              )
            }
            onClick={onFileButtonClick}
          >
            {loading ? (
              <Skeleton width="100%" />
            ) : createdBy ? (
              'Download File'
            ) : (
              dueDate && 'Upload File'
            )}
          </Button>
          <Typography
            color="initial"
            variant="h6"
            className={classes.reportDue}
          >
            {loading ? (
              <Skeleton animation="pulse" />
            ) : (
              nextDueDate && `Next Report Due ${dateFormatter(nextDueDate)}`
            )}
          </Typography>
          <Typography
            color="initial"
            variant="h6"
            className={classes.reportsCount}
          >
            {loading ? <Skeleton animation="pulse" /> : total || ''}
          </Typography>
        </div>
      </CardActionAreaLink>
    </Card>
  );
};
