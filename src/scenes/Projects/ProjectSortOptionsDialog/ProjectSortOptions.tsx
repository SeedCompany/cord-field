import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  makeStyles,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import { ChangeEvent, FC, useState } from 'react';
import * as React from 'react';
import { ProjectSortOptionsFormControlLabel } from './ProjectSortOptionsFormControlLabel';
import { ProjectSortOptionsFormLabel } from './ProjectSortOptionsFormLabel';

const useStyles = makeStyles(({ palette, spacing }) => ({
  button: {
    backgroundColor: palette.common.white,
  },
  dialog: {
    width: '431px',
  },
  dialogTitle: {
    display: 'flex',
    alignItems: 'center',
    border: '0.5px solid #d1dadf',
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
        <DialogTitle className={classes.dialogTitle} disableTypography>
          <Typography variant="h3">Sort Options</Typography>
          <IconButton
            size="small"
            aria-label="close"
            className={classes.closeButton}
            onClick={() => setOpen(false)}
          >
            <Cancel />
          </IconButton>
        </DialogTitle>
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
