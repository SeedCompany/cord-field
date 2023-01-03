import {
  Box,
  Button,
  ButtonProps,
  Skeleton,
  TooltipProps,
} from '@mui/material';
import { isFunction } from 'lodash';
import { ReactNode } from 'react';
import { extendSx, SecuredProp } from '~/common';
import { Redacted } from '../Redacted';

export const DataButton = <T extends any>({
  loading,
  secured,
  empty,
  redacted,
  children,
  startIcon,
  sx,
  label,
  ...props
}: Omit<ButtonProps, 'children'> & {
  loading?: boolean;
  secured?: SecuredProp<T>;
  redacted?: TooltipProps['title'];
  children: ((value: T) => ReactNode) | ReactNode;
  empty?: ReactNode;
  label?: ReactNode;
}) => {
  const showData = !loading && (secured ? secured.canRead : true);

  const data = isFunction(children)
    ? showData && secured?.value
      ? children(secured.value) ?? empty
      : empty
    : children ?? empty;

  const btn = (
    <Button
      variant="outlined"
      color="secondary"
      {...props}
      sx={[
        {
          alignItems: 'start',
          flexDirection: 'column',
        },
        ...extendSx(sx),
      ]}
    >
      {label && <Box sx={{ fontSize: '0.75rem' }}>{label}</Box>}
      <Box display="flex">
        {startIcon && (
          <Box
            component="span"
            sx={{ display: 'inline-flex', ml: -0.5, mr: 1 }}
          >
            {startIcon}
          </Box>
        )}
        {data || <>&nbsp;</>}
      </Box>
    </Button>
  );

  return loading ? (
    <Skeleton>{btn}</Skeleton>
  ) : !showData ? (
    <Redacted info={redacted ?? ''}>{btn}</Redacted>
  ) : (
    btn
  );
};
