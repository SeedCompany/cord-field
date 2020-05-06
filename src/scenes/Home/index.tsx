import React from 'react';
import { useSession } from '../../components/Session';
import { useTitle } from '../../components/title';

export const Home = () => {
  useTitle('Home');
  const [session] = useSession();

  return (
    <div>
      <div>Welcome, {session?.displayFirstName.value ?? 'Friend'}</div>
    </div>
  );
};
