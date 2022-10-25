import {
  ChangeHistory as ChangeIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Alert, AlertTitle, Tooltip } from '@mui/material';
import { extendSx, StyleProps } from '~/common';
import { IconButton } from '../IconButton';

interface Props extends StyleProps {
  changesetId: string | null;
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
      sx={[{ maxWidth: 'md', mx: 2 }, ...extendSx(props.sx)]}
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
