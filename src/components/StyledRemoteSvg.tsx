import { Box } from '@mui/material';
import fetch from 'cross-fetch';
import useSWR from 'swr';
import { StyleProps } from '~/common';

export type StyledRemoteSvgProps = { url: string } & StyleProps;

export const StyledRemoteSvg = ({
  url,
  sx,
  className,
}: StyledRemoteSvgProps) => {
  const { data } = useSWR(url, fetcher);
  return (
    <Box
      sx={sx}
      className={className}
      dangerouslySetInnerHTML={{ __html: data ?? '' }}
    />
  );
};

const fetcher = (url: string) =>
  fetch(url, {
    mode: 'cors',
    credentials: 'include',
  }).then((r) => r.text());
