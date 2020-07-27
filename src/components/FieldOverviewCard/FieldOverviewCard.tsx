import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { To } from 'history';
import { DateTime } from 'luxon';
import { FC } from 'react';
import * as React from 'react';
import { useDateTimeFormatter } from '../Formatters';
import { HugeIcon, HugeIconProps } from '../Icons';
import { ButtonLink, CardActionAreaLink } from '../Routing';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    flex: 1,
    height: '100%',
  },
  topArea: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: spacing(3, 4),
  },
  rightContent: {
    flex: 1,
    paddingLeft: spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  emptyValue: {
    color: palette.action.disabled,
  },
  bottomArea: {
    paddingRight: spacing(1),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

interface FieldOverviewCardData {
  value?: string;
  updatedAt?: DateTime;
  to?: To;
}

export interface FieldOverviewCardProps extends Pick<HugeIconProps, 'icon'> {
  title?: string;
  viewLabel?: string;
  data?: FieldOverviewCardData;
  className?: string;
  emptyValue?: string;
  onClick?: () => void;
  onButtonClick?: () => void;
}

const DEFAULT_EMPTY = <>&nbsp;</>;

export const FieldOverviewCard: FC<FieldOverviewCardProps> = ({
  className,
  viewLabel: buttonLabel,
  title,
  icon,
  data,
  emptyValue = DEFAULT_EMPTY,
  onClick,
  onButtonClick,
}) => {
  const classes = useStyles();
  const dateTimeFormatter = useDateTimeFormatter();

  const ActionArea = data?.to ? CardActionAreaLink : CardActionArea;
  const Btn = data?.to ? ButtonLink : Button;

  return (
    <Card className={clsx(classes.root, className)}>
      <ActionArea
        disabled={!data}
        to={data?.to ?? ''}
        className={classes.topArea}
        onClick={onClick}
      >
        <HugeIcon icon={icon} loading={!data} />
        <div className={classes.rightContent}>
          <Typography color="initial" variant="h4">
            {data ? title : <Skeleton width="80%" />}
          </Typography>
          <Typography
            color="initial"
            variant="h1"
            className={clsx({
              [classes.emptyValue]: data && !data.value,
            })}
          >
            {data ? data.value || emptyValue : <Skeleton />}
          </Typography>
        </div>
      </ActionArea>
      {buttonLabel && (
        <CardActions>
          <Grid
            container
            spacing={!data ? 4 : 2}
            wrap="nowrap"
            className={classes.bottomArea}
          >
            <Grid item xs={!data}>
              <Btn
                color="primary"
                to={data?.to ?? ''}
                disabled={!data}
                fullWidth
                onClick={onButtonClick}
              >
                {data ? buttonLabel : <Skeleton width="100%" />}
              </Btn>
            </Grid>
            <Grid item xs={!data}>
              <Typography color="textSecondary" variant="body2">
                {data ? (
                  data.updatedAt ? (
                    <> Updated {dateTimeFormatter(data.updatedAt)}</>
                  ) : null
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardActions>
      )}
    </Card>
  );
};
