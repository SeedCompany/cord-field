import { ChangeHistory as ChangeIcon } from '@mui/icons-material';
import { Alert } from '@mui/material';

interface Props {
  variant?: 'modifying' | 'ignoring';
}
export const ChangesetModificationWarning = ({ variant }: Props) => {
  if (variant === 'modifying') {
    return (
      <Alert severity="info" icon={<ChangeIcon fontSize="inherit" />}>
        Modifying Change Request
      </Alert>
    );
  }
  if (variant === 'ignoring') {
    return (
      <Alert severity="warning">
        This will not apply to the Change Request
      </Alert>
    );
  }
  return null;
};
