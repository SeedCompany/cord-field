import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  makeStyles,
  RadioGroup,
} from '@material-ui/core';
import { ChangeEvent, FC, useState } from 'react';
import * as React from 'react';
import { DialogTitle } from '../../../components/Dialog';
import { ProjectSortOptionsFormControlLabel } from './ProjectSortOptionsFormControlLabel';
import { ProjectSortOptionsFormLabel } from './ProjectSortOptionsFormLabel';

const useStyles = makeStyles(({ palette, spacing }) => ({
  button: {
    backgroundColor: palette.common.white,
  },
  dialog: {
    width: '431px',
  },
  dialogContent: {
    paddingBottom: spacing(2),
  },
  closeButton: {
    marginLeft: 'auto',
  },
}));

export interface ProjectSortOptionsProps {
  value: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const ProjectSortOptions: FC<ProjectSortOptionsProps> = ({
  value,
  onChange,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button
        className={classes.button}
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        Sort Options
      </Button>
      <Dialog
        fullWidth
        maxWidth="xs"
        onClose={() => setOpen(false)}
        open={open}
      >
        <DialogTitle onClose={() => setOpen(false)}>Sort Options</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="sort-option"
              name="sort-option"
              value={value}
              onChange={onChange}
            >
              <ProjectSortOptionsFormLabel label="Projects" />
              <ProjectSortOptionsFormControlLabel
                value="alphabeticalDesc"
                label="A-Z"
              />
              <ProjectSortOptionsFormControlLabel
                value="alphabeticalAsc"
                label="Z-A"
              />
              <ProjectSortOptionsFormLabel label="Sensitivity" />
              <ProjectSortOptionsFormControlLabel
                value="sensitivityDesc"
                label="High to Low"
              />
              <ProjectSortOptionsFormControlLabel
                value="senstivityAsc"
                label="Low to High"
              />
              <ProjectSortOptionsFormLabel label="Estimated Submission Date" />
              <ProjectSortOptionsFormControlLabel
                value="submissionDateDesc"
                label="Closest Date to Furthest"
              />
              <ProjectSortOptionsFormControlLabel
                value="submissionDateAsc"
                label="Furthest Date to Closes"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
      </Dialog>
    </>
  );
};
