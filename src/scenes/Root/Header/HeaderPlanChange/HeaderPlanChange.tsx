import { Card, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Close, Info } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { useCurrentPlanChange } from '../../../../components/PlanChangeCard';

const useStyles = makeStyles(({ typography, spacing }) => ({
  card: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    padding: spacing(1),
  },
  name: {
    fontWeight: typography.weight.medium,
    margin: spacing(0, 1, 0, 2),
  },
}));

export const HeaderPlanChange: FC = () => {
  const classes = useStyles();
  const [changeId, setCurrent] = useCurrentPlanChange();

  if (!changeId) {
    return null;
  }

  return (
    <>
      <Card className={classes.card}>
        <Info />
        <Typography className={classes.name} color="primary">
          You are in CR mode and changes will be requested - {changeId}
        </Typography>
        <IconButton color="inherit" onClick={() => setCurrent(null)}>
          <Close />
        </IconButton>
      </Card>
    </>
  );
};
