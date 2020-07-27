import {
  FormControlLabel,
  makeStyles,
  Switch,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import * as React from 'react';
import { FC } from 'react';
import { CeremonyCardFragment } from './CeremonyCard.generated';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  loadingWidth: {
    width: '40%',
  },
  switch: {
    paddingLeft: 2,
  },
  switchHidden: {
    visibility: 'hidden',
    width: 0,
    padding: 0,
  },
}));

type CeremonyCardProps = Partial<CeremonyCardFragment> & {
  onPlannedChange?: (planned: boolean) => void;
  className?: string;
};

export const CeremonyPlanned: FC<CeremonyCardProps> = ({
  canRead: canReadCeremony,
  value: ceremony,
  onPlannedChange,
  className,
}) => {
  const { type, planned } = ceremony || {};
  const loading = canReadCeremony == null;
  const canRead = canReadCeremony && planned?.canRead;

  const classes = useStyles();

  let title = (
    <Typography
      variant="h4"
      className={loading ? classes.loadingWidth : undefined}
    >
      {loading ? <Skeleton width="100%" /> : type}
    </Typography>
  );
  if (canRead) {
    title = (
      <Tooltip
        title={`A ${type?.toLowerCase()} ${
          planned?.value ? 'IS' : 'is NOT'
        } planned`}
      >
        {title}
      </Tooltip>
    );
  }
  return (
    <div className={clsx(classes.root, className)}>
      {loading || !canRead ? (
        <>
          <Switch className={clsx(classes.switch, classes.switchHidden)} />
          {title}
        </>
      ) : (
        <FormControlLabel
          control={
            <Tooltip title={`Is a ${type?.toLowerCase()} planned?`}>
              <Switch
                checked={Boolean(planned?.value)}
                name="planned"
                color="primary"
                disabled={!planned?.canEdit}
                onChange={(_, checked) => onPlannedChange?.(checked)}
              />
            </Tooltip>
          }
          label={title}
          className={classes.switch}
        />
      )}
    </div>
  );
};
