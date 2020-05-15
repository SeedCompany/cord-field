import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../../components/Session';
import { useLogoutMutation } from './logout.generated';

export const Logout = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [, , setCurrentUser] = useSession();

  useEffect(() => {
    logout().then(() => {
      setCurrentUser(null);
      navigate('/login', { replace: true });
    });
  }, [logout, setCurrentUser, navigate]);

  return <CircularProgress />;
};
