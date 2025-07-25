import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ChildrenProp } from '~/common';

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
      sx={{
        p: 1,
        borderRadius: 1,
        margin: 0,
        color: 'common.white',
        bgcolor: 'grey.800',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        ...sx,
      }}
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
