import {
  ChangeHistory as ChangeIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Alert, AlertTitle, Tooltip } from '@mui/material';
import { IconButton } from '../IconButton';

interface Props {
  changesetId: string | undefined;
  onEdit?: () => void;
  onClose?: () => void;
}

export const ChangesetBanner = (props: Props) => {
  if (!props.changesetId) {
    return null;
  }
  return (
    <Alert
      severity="info"
      icon={<ChangeIcon fontSize="inherit" />}
      sx={(theme) => ({
        maxWidth: theme.breakpoints.values.md,
        margin: theme.spacing(0, 2),
      })}
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
