import { Button } from '@material-ui/core';
import React from 'react';
import { useDialog } from '../../components/Dialog';
import { useSession } from '../../components/Session';
import { useTitle } from '../../components/title';
import { CreateOrganization } from '../Organizations/Create';

export const Home = () => {
  useTitle('Home');
  const [session] = useSession();
  const [orgDialog, createOrg] = useDialog();

  return (
    <div>
      <div>Welcome, {session?.displayFirstName.value ?? 'Friend'}</div>
      <Button onClick={createOrg} color="primary" variant="contained">
        Create Organization
      </Button>
      <CreateOrganization {...orgDialog} />
    </div>
  );
};
