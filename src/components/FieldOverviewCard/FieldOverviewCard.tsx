import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  Grid,
  makeStyles,
  Tooltip,
  TooltipProps,
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
    display: 'flex',
    flexDirection: 'column',
  },
  topArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-evenly',
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
  className?: string;
  data?: FieldOverviewCardData;
  emptyValue?: string;
  loading?: boolean;
  onButtonClick?: () => void;
  onClick?: () => void;
  redactedText?: TooltipProps['title'];
  redacted?: boolean;
  title?: string;
  viewLabel?: string;
}

const DEFAULT_EMPTY = <>&nbsp;</>;

export const FieldOverviewCard: FC<FieldOverviewCardProps> = ({
  className,
  data,
  emptyValue = DEFAULT_EMPTY,
  icon,
  loading,
  onClick,
  onButtonClick,
  redactedText = 'You do not have permission to view this information',
  redacted,
  title,
  viewLabel: buttonLabel,
}) => {
  const classes = useStyles();
  const dateTimeFormatter = useDateTimeFormatter();

  const showData = !loading && !redacted;
  const ActionArea = showData && data?.to ? CardActionAreaLink : CardActionArea;
  const Btn = data?.to ? ButtonLink : Button;

  const card = (
    <Card className={clsx(classes.root, className)}>
      <ActionArea
        disabled={!data || redacted}
        to={data?.to ?? ''}
        className={classes.topArea}
        onClick={onClick}
      >
        <HugeIcon icon={icon} loading={!data} />
        <div className={classes.rightContent}>
          <Typography color="initial" variant="h4">
            {loading ? <Skeleton width="80%" /> : data ? title : ''}
          </Typography>
          <Typography
            color="initial"
            variant="h1"
            className={clsx({
              [classes.emptyValue]: data && !data.value,
            })}
          >
            {loading || redacted ? (
              <Skeleton animation={loading ? 'pulse' : false} />
            ) : data ? (
              data.value || emptyValue
            ) : (
              ''
            )}
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
                disabled={redacted || !data}
                fullWidth
                onClick={onButtonClick}
              >
                {loading ? (
                  <Skeleton width="100%" />
                ) : !redacted && data ? (
                  buttonLabel
                ) : (
                  <>&nbsp;</>
                )}
              </Btn>
            </Grid>
            <Grid item xs={!data}>
              {!redacted && (
                <Typography color="textSecondary" variant="body2">
                  {loading ? (
                    <Skeleton />
                  ) : data?.updatedAt ? (
                    <> Updated {dateTimeFormatter(data.updatedAt)}</>
                  ) : null}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardActions>
      )}
    </Card>
  );

  return redacted ? <Tooltip title={redactedText}>{card}</Tooltip> : card;
};
