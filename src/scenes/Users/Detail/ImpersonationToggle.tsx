import {
  PersonOffOutlined as DisableIcon,
  SupervisorAccountOutlined as EnableIcon,
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useContext } from 'react';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { DisplayUserFragment } from '~/common/fragments';
import { useSession } from '../../../components/Session';

export const ImpersonationToggle = ({
  user: subject,
}: {
  user?: DisplayUserFragment;
}) => {
  const { session, impersonator } = useSession();
  const loggedInUser = impersonator ?? session;
  // Only show to admins for now
  const isAdmin = loggedInUser?.roles.value.includes('Administrator');

  const impersonation = useContext(ImpersonationContext);
  const isImpersonatingThis = impersonation.user === subject?.id;

  if (!subject || !isAdmin || subject.id === loggedInUser?.id) {
    return null;
  }

  const Icon = isImpersonatingThis ? DisableIcon : EnableIcon;

  return (
    <Tooltip title={isImpersonatingThis ? 'Stop impersonating' : 'Impersonate'}>
      <IconButton
        onClick={() =>
          impersonation.set(isImpersonatingThis ? {} : { user: subject.id })
        }
      >
        <Icon />
      </IconButton>
    </Tooltip>
  );
};
