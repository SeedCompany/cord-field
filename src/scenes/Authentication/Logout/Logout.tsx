import { useApolloClient } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from './logout.generated';

export const Logout = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    void logout().then(() =>
      client.resetStore().then(() => {
        navigate('/login', { replace: true });
      })
    );
  }, [logout, client, navigate]);

  return <CircularProgress />;
};
