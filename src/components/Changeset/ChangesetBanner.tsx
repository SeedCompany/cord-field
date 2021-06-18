import { makeStyles, Tooltip } from '@material-ui/core';
import {
  ChangeHistory as ChangeIcon,
  Close as CloseIcon,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import * as React from 'react';
import { useCurrentChangeset } from '../../api';
import { IconButton } from '../IconButton';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    maxWidth: breakpoints.values.md,
    margin: spacing(0, 2),
  },
}));

export const ChangesetBanner = () => {
  const [changeset, setChangeset] = useCurrentChangeset();
  const classes = useStyles();
  if (!changeset) {
    return null;
  }
  return (
    <Alert
      severity="info"
      icon={<ChangeIcon fontSize="inherit" />}
      className={classes.root}
      action={
        <Tooltip title="Close Change Request">
          <IconButton
            color="inherit"
            size="medium"
            onClick={() => setChangeset(null)}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <AlertTitle>Viewing Change Request</AlertTitle>
      You are currently viewing a change request — {changeset}
      <br />
      Any modifications (with this notice) will be applied to this change
      request.
    </Alert>
  );
};
