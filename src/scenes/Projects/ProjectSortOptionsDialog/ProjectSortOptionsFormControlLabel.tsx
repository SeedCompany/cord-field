import { FormControlLabel, Radio } from '@material-ui/core';
import { FC } from 'react';
import * as React from 'react';

export interface ProjectSortOptionsFormControlLabelProps {
  label: string;
  value: string;
}

export const ProjectSortOptionsFormControlLabel: FC<ProjectSortOptionsFormControlLabelProps> = ({
  value,
  label,
}) => {
  return (
    <FormControlLabel
      value={value}
      control={<Radio size="small" />}
      label={label}
    />
  );
};
