import { MaybeAsync } from '@seedcompany/common';
import { useCallback } from 'react';
import useSWR from 'swr';
import { NonDirectoryActionItem } from '../FileActions';

export const useFilePreview = <X extends {} = Blob>(
  file: NonDirectoryActionItem,
  parser?: (data: Blob) => MaybeAsync<X>
) => {
  const fetcher = useCallback(async (url: string) => {
    const response = await fetch(url, {
      credentials: 'include',
    });
    if (response.status !== 200) {
      throw new Error('Could not retrieve file');
    }
    const raw = await response.blob();
    try {
      return parser ? await parser(raw) : (raw as any as X);
    } catch (e) {
      console.error(e);
      throw new Error('Could not parse file');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- no parser cannot change between renders
  }, []);
  const res = useSWR<X>(file.url, {
    suspense: true,
    fetcher,
  });
  return res.data!;
};
