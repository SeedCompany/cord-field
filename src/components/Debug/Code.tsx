import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChildrenProp, extendSx } from '~/common';

interface CodeProps extends Omit<BoxProps, 'component'> {
  json?: any;
}

export const Code = ({
  json,
  children,
  sx,
  ...rest
}: CodeProps & ChildrenProp) => {
  return (
    <Box
      component="pre"
      sx={[
        (theme) => ({
          padding: theme.spacing(1),
          borderRadius: theme.shape.borderRadius,
          color: theme.palette.background.paper,
          backgroundColor: theme.palette.grey[800],
        }),
        ...extendSx(sx),
      ]}
      {...rest}
    >
      {json ? JSON.stringify(json, undefined, 2) : children}
    </Box>
  );
};

export const InlineCode = styled('code')(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[300],
}));
