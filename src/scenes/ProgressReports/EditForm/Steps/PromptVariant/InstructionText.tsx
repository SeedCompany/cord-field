import { Box } from '@mui/material';
import { ChildrenProp, StyleProps } from '~/common';

export const InstructionText = (props: ChildrenProp & StyleProps) => (
  <Box
    textAlign="justify"
    css={(theme) => ({
      '& ol, & ul': {
        marginBlockStart: theme.spacing(0.5),
        paddingInlineStart: theme.spacing(4),
      },
      '& li': {
        ...(theme.typography.body2 as any),
        fontWeight: theme.typography.weight.regular,
      },
    })}
    {...props}
  />
);
