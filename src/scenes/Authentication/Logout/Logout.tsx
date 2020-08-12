import { useApolloClient } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../../components/Session';
import { useLogoutMutation } from './logout.generated';

export const Logout = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [logout] = useLogoutMutation();
  const [, , setCurrentUser] = useSession();

  useEffect(() => {
    void logout()
      .then(() => client.resetStore())
      .then(() => {
        setCurrentUser(null);
        navigate('/login', { replace: true });
      });
  }, [logout, client, setCurrentUser, navigate]);

  return <CircularProgress />;
};
