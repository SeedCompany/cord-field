import { useSnackbar } from 'notistack';
import React from 'react';
import { useIsomorphicEffect, useUserAgent } from '../../hooks';

export const useOldChromeWarning = () => {
  const ua = useUserAgent();
  const { enqueueSnackbar } = useSnackbar();
  useIsomorphicEffect(() => {
    const raw = ua.match(/Chrom(e|ium)\/([0-9]+)\./);
    const chromeVersion = raw?.[2] ? parseInt(raw[2], 10) : undefined;
    if (chromeVersion && chromeVersion > 97) {
      return;
    }
    enqueueSnackbar(
      <div>
        It looks like you are using an old version of Chrome. This can cause
        problems with file uploads.
        <br />
        Reach out to the IT Helpdesk to help re-enable auto updates.
      </div>,
      {
        variant: 'warning',
        autoHideDuration: 30_000,
      }
    );
  }, [ua]);
};
