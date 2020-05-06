import { FormLabel, makeStyles } from '@material-ui/core';
import { FC } from 'react';
import * as React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  formLabel: {
    fontSize: '18px',
    fontWeight: 600,
    margin: spacing(2, 0, 1, 0),
  },
}));

export interface ProjectSortOptionsFormLabelProps {
  label: string;
}

export const ProjectSortOptionsFormLabel: FC<ProjectSortOptionsFormLabelProps> = ({
  label,
}) => {
  const classes = useStyles();

  return (
    <FormLabel focused={false} className={classes.formLabel} component="legend">
      {label}
    </FormLabel>
  );
};
