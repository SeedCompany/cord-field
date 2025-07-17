import { Stack } from '@mui/material';
import { ChildrenProp, extendSx, StyleProps } from '~/common';

export const Footer = (props: ChildrenProp & StyleProps) => {
  return (
    <Stack
      {...props}
      sx={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          background: 'var(--DataGrid-containerBackground)',
          p: 1,
          borderTop: 'thin solid var(--DataGrid-rowBorderColor)',
        },
        ...extendSx(props.sx),
      ]}
    >
      {props.children}
    </Stack>
  );
};
