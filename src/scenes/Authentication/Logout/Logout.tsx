import { useApolloClient, useMutation } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutDocument } from './logout.generated';

export const Logout = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [logout] = useMutation(LogoutDocument);

  // NOTE: SSR logout is handled independently in server.ts
  useEffect(() => {
    void logout()
      .then(() => client.resetStore())
      .then(() => {
        navigate('/login', { replace: true });
      });
  }, [logout, client, navigate]);

  return <CircularProgress />;
};
