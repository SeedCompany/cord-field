import { Box } from '@mui/material';
import { ChildrenProp, extendSx, StyleProps } from '~/common';

export const ContentContainer = (
  props: { className?: string } & ChildrenProp & StyleProps
) => {
  return (
    <Box
      className={props.className}
      sx={[
        (theme) => ({
          flex: 1,
          overflow: 'hidden',
          padding: theme.spacing(4, 0, 0, 4),
          display: 'flex',
          flexDirection: 'column',
        }),
        ...extendSx(props.sx),
      ]}
    >
      {props.children}
    </Box>
  );
};
