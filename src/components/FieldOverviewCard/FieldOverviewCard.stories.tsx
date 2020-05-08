import { makeStyles } from '@material-ui/core';
import { text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { FieldOverviewCard as FieldOverviewCardComponent } from '.';
import { CordIcon, HugeIcon } from '../Icons';

export default { title: 'Components' };

const useStyles = makeStyles(() => ({
  card: {
    width: '327px',
  },
}));

export const FieldOverviewCard = () => {
  const classes = useStyles();

  return (
    <FieldOverviewCardComponent
      className={classes.card}
      title={text('title', 'Project Budget')}
      to="/foo"
      value="$45,978"
      icon={<HugeIcon icon={CordIcon} />}
      updatedAt={DateTime.local()}
      viewLabel={text('viewLabel', 'Budget History')}
    />
  );
};
