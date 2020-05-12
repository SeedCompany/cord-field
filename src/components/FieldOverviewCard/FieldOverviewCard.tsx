import { Card, makeStyles, SvgIconProps, Typography } from '@material-ui/core';
import { To } from 'history';
import { DateTime } from 'luxon';
import { FC, ReactElement } from 'react';
import * as React from 'react';
import { ButtonLink, CardActionAreaLink } from '../Routing';

const useStyles = makeStyles(({ spacing, palette }) => ({
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

export interface FieldOverviewCardProps {
  className?: string;
  title: string;
  value: string;
  icon: ReactElement<SvgIconProps>;
  updatedAt: DateTime;
  to: To;
  viewLabel: string;
}

export const FieldOverviewCard: FC<FieldOverviewCardProps> = ({
  className,
  title,
  value,
  icon,
  updatedAt,
  to,
  viewLabel,
}) => {
  const classes = useStyles();

  return (
    <Card className={className}>
      <CardActionAreaLink to={to} className={classes.topArea}>
        {icon}
        <div className={classes.rightContent}>
          <Typography color="initial" variant="h4">
            {title}
          </Typography>
          <Typography color="initial" variant="h1">
            {value}
          </Typography>
        </div>
      </CardActionAreaLink>
      <div className={classes.bottomArea}>
        <ButtonLink color="primary" to={to}>
          {viewLabel}
        </ButtonLink>
        <Typography color="textSecondary" variant="body2">
          Updated {updatedAt.toLocaleString(DateTime.DATE_SHORT)}
        </Typography>
      </div>
    </Card>
  );
};
