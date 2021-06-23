import { makeStyles, Tooltip } from '@material-ui/core';
import {
  ChangeHistory as ChangeIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import * as React from 'react';
import { IconButton } from '../../../components/IconButton';
import { ProjectChangeRequestListItemFragment as ChangeRequest } from '../../../components/ProjectChangeRequestListItem';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    maxWidth: breakpoints.values.md,
    margin: spacing(0, 2),
  },
}));

interface Props {
  changesetId: string | null;
  changeset?: ChangeRequest | null;
  onClose?: () => void;
  onEdit?: () => void;
}

export const ProjectChangeRequestBanner = (props: Props) => {
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
          <Tooltip title="Edit Change Request">
            <IconButton color="inherit" onClick={props.onEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Close Change Request">
            <IconButton color="inherit" onClick={props.onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
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
