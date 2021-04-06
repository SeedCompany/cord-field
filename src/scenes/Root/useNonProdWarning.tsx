// eslint-disable-next-line no-restricted-imports -- need an external link
import { IconButton, Link } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useIsomorphicEffect } from '../../hooks';

export const useNonProdWarning = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useIsomorphicEffect(() => {
    if (process.env.RAZZLE_NON_PROD_WARNING !== 'true') {
      return;
    }
    enqueueSnackbar(
      <div>
        This site is for training purposes only. Keep data entry generic.
        <br />
        Please use{' '}
        <Link color="inherit" href="https://cordfield.com">
          cordfield.com
        </Link>{' '}
        for official reporting.
      </div>,
      {
        variant: 'warning',
        autoHideDuration: 30_000,
        action: (key: string) => (
          <IconButton color="inherit" onClick={() => closeSnackbar(key)}>
            <Close />
          </IconButton>
        ),
      }
    );
  }, []);
};
