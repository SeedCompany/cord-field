import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  Grid,
  Skeleton,
  Tooltip,
  TooltipProps,
  Typography,
} from '@mui/material';
import { To } from 'history';
import { ReactNode } from 'react';
import { DateTimeOrISO } from '~/common';
import { FormattedDateTime } from '../Formatters';
import { HugeIcon, HugeIconProps } from '../Icons';
import { ButtonLink, CardActionAreaLink } from '../Routing';

interface FieldOverviewCardData {
  value?: ReactNode;
  updatedAt?: DateTimeOrISO;
  to?: To;
}

export interface FieldOverviewCardProps extends Pick<HugeIconProps, 'icon'> {
  data?: FieldOverviewCardData;
  emptyValue?: ReactNode;
  loading?: boolean;
  onButtonClick?: () => void;
  onClick?: () => void;
  redactedText?: TooltipProps['title'];
  redacted?: boolean;
  title?: string;
  viewLabel?: string;
}

const DEFAULT_EMPTY = <>&nbsp;</>;

export const FieldOverviewCard = ({
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
}: FieldOverviewCardProps) => {
  const showData = !loading && !redacted;
  const ActionArea = showData && data?.to ? CardActionAreaLink : CardActionArea;
  const Btn = data?.to ? ButtonLink : Button;

  const card = (
    <Card
      sx={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ActionArea
        disabled={!data || redacted}
        to={data?.to ?? ''}
        sx={(theme) => ({
          flex: 1,
          display: 'flex',
          justifyContent: 'space-evenly',
          padding: theme.spacing(3, 4),
        })}
        onClick={onClick}
      >
        <HugeIcon icon={icon} loading={!data} />
        <Box
          sx={{
            flex: 1,
            alignSelf: 'flex-start',
            pl: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
        >
          <Typography variant="h4">
            {loading ? <Skeleton width="80%" /> : data ? title : ''}
          </Typography>
          <Typography
            variant="h1"
            sx={{
              ...(data &&
                !data.value && {
                  color: (theme) => theme.palette.action.disabled,
                }),
            }}
          >
            {loading || redacted ? (
              <Skeleton animation={loading ? 'pulse' : false} />
            ) : data ? (
              data.value || emptyValue
            ) : (
              ''
            )}
          </Typography>
        </Box>
      </ActionArea>
      {buttonLabel && (
        <CardActions>
          <Grid
            container
            spacing={loading ? 4 : 2}
            wrap="nowrap"
            sx={{
              pr: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Grid item xs={loading}>
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
            <Grid item xs={loading}>
              {!redacted && (
                <Typography color="textSecondary" variant="body2">
                  {loading ? (
                    <Skeleton />
                  ) : data?.updatedAt ? (
                    <>
                      {' '}
                      Updated <FormattedDateTime date={data.updatedAt} />
                    </>
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
