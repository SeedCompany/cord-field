import { ChangeHistory as ChangeIcon } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import * as React from 'react';
import { useCurrentChangeset } from '../../api';

export const ChangesetModificationWarning = () => {
  const [changeset] = useCurrentChangeset();
  if (!changeset) {
    return null;
  }
  return (
    <Alert severity="info" icon={<ChangeIcon fontSize="inherit" />}>
      Modifying Change Request
    </Alert>
  );
};
