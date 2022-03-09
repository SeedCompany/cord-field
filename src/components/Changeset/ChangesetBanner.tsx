import { makeStyles, Tooltip } from '@material-ui/core';
import {
  ChangeHistory as ChangeIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import * as React from 'react';
import { IconButton } from '../IconButton';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    maxWidth: breakpoints.values.md,
    margin: spacing(0, 2),
  },
}));

interface Props {
  changesetId: string | null;
  onEdit?: () => void;
  onClose?: () => void;
}

export const ChangesetBanner = (props: Props) => {
  const classes = useStyles();

  if (!props.changesetId) {
    return null;
  }
  return (
    <Alert
      severity="info"
      icon={<ChangeIcon fontSize="inherit" />}
      className={classes.root}
      action={
        <>
          {props.onEdit && (
            <Tooltip title="Edit Change Request">
              <IconButton color="inherit" onClick={props.onEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}

          {props.onClose && (
            <Tooltip title="Close Change Request">
              <IconButton color="inherit" onClick={props.onClose}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      }
    >
      <AlertTitle>Viewing Change Request</AlertTitle>
      You are currently viewing a change request — {props.changesetId}
      <br />
      Any modifications (with this notice) will be applied to this change
      request.
    </Alert>
  );
};
