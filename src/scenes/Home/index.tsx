import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useSession } from '../../components/Session';
import { useTitle } from '../../components/title';
import { CreateOrganization } from '../Organizations/Create';

export const Home = () => {
  useTitle('Home');
  const [session] = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div>Welcome, {session?.displayFirstName.value ?? 'Friend'}</div>
      <Button onClick={() => setOpen(true)} color="primary" variant="contained">
        CreateOrg
      </Button>
      <CreateOrganization
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};
