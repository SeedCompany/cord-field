import { Box } from '@mui/material';
import { ChildrenProp } from '~/common';

export const ContentContainer = (
  props: { className?: string } & ChildrenProp
) => {
  return (
    <Box
      className={props.className}
      sx={(theme) => ({
        flex: 1,
        overflow: 'hidden',
        padding: theme.spacing(4, 0, 0, 4),
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      {props.children}
    </Box>
  );
};
