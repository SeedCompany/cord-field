import { Card, makeStyles, SvgIconProps, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { To } from 'history';
import { DateTime } from 'luxon';
import { FC, ReactElement } from 'react';
import * as React from 'react';
import { useDateTimeFormatter } from '../Formatters';
import { ButtonLink, CardActionAreaLink } from '../Routing';

const useStyles = makeStyles(({ spacing, palette }) => ({
  skeletonIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '30px',
  },
  topArea: {
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: spacing(3, 4),
    borderBottom: `0.5px solid ${palette.grey[300]}`,
  },
  rightContent: {
    paddingLeft: spacing(4),
  },
  bottomArea: {
    display: 'flex',
    padding: spacing(1, 2, 1, 1),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

interface FieldOverviewCardData {
  title: string;
  value: string;
  icon: ReactElement<SvgIconProps>;
  updatedAt: DateTime | string;
  to: To;
  viewLabel: string;
}

export interface FieldOverviewCardProps {
  className?: string;
  data?: FieldOverviewCardData;
}

export const FieldOverviewCard: FC<FieldOverviewCardProps> = ({
  className,
  data,
}) => {
  const classes = useStyles();
  const dateTimeFormatter = useDateTimeFormatter();

  return (
    <Card className={className}>
      <CardActionAreaLink
        disabled={!data}
        to={data?.to || ''}
        className={classes.topArea}
      >
        {data?.icon || (
          <Skeleton variant="rect" className={classes.skeletonIcon} />
        )}
        <div className={classes.rightContent}>
          <Typography color="initial" variant="h4">
            {data?.title || <Skeleton variant="text" width={120} />}
          </Typography>
          <Typography color="initial" variant="h1">
            {data?.value || <Skeleton variant="text" width={160} />}
          </Typography>
        </div>
      </CardActionAreaLink>
      <div className={classes.bottomArea}>
        <ButtonLink color="primary" to={data?.to || ''} disabled={!data}>
          {data?.viewLabel || <Skeleton variant="text" width={100} />}
        </ButtonLink>
        <Typography color="textSecondary" variant="body2">
          {data ? (
            <> Updated {dateTimeFormatter(data.updatedAt)}</>
          ) : (
            <Skeleton variant="text" width={120} />
          )}
        </Typography>
      </div>
    </Card>
  );
};
