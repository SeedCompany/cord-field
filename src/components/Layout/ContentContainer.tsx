import { Box } from '@mui/material';
import { ChildrenProp, extendSx, StyleProps } from '~/common';

export const ContentContainer = (
  props: { className?: string } & ChildrenProp & StyleProps
) => {
  return (
    <Box
      className={props.className}
      sx={[
        {
          flex: 1,
          overflow: 'hidden',
          pt: 4,
          pl: 4,
          display: 'flex',
          flexDirection: 'column',
        },
        ...extendSx(props.sx),
      ]}
    >
      {props.children}
    </Box>
  );
};
