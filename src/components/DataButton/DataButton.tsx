import {
  Box,
  Button,
  ButtonProps,
  Skeleton,
  TooltipProps,
  Typography,
} from '@mui/material';
import { isFunction } from 'lodash';
import { cloneElement, isValidElement, ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';
import { extendSx, SecuredProp, Sx } from '~/common';
import { Redacted } from '../Redacted';

const useStyles = makeStyles()(() => ({
  buttonLoading: {
    maxWidth: 'initial',
  },
}));

const dataButtonStyles: Sx = {
  alignItems: 'start',
  justifyContent: 'center',
  flexDirection: 'column',
  height: 1,
};

const dataButtonLabelStyles: Sx = {
  fontSize: '0.75rem',
};

const iconStyles: Sx = {
  marginBottom: -0.75,
  marginRight: 0.5,
};

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
  const { classes } = useStyles();
  const showData = !loading && (secured ? secured.canRead : true);

  const data = isFunction(children)
    ? showData && secured?.value
      ? children(secured.value) ?? empty
      : empty
    : children ?? empty;

  const iconWithStyles = isValidElement(startIcon)
    ? cloneElement(startIcon, {
        ...startIcon.props,
        sx: [startIcon.props.sx, ...extendSx(iconStyles)],
      })
    : startIcon;

  const btn = (
    <Button
      variant="outlined"
      color="secondary"
      {...props}
      sx={[dataButtonStyles, ...extendSx(sx)]}
    >
      {label && (
        <Typography component="span" sx={dataButtonLabelStyles}>
          {label}
        </Typography>
      )}
      <Box sx={{ flexDirection: 'row' }}>
        {iconWithStyles}
        {data || <>&nbsp;</>}
      </Box>
    </Button>
  );

  return loading ? (
    <Skeleton classes={{ fitContent: classes.buttonLoading }}>{btn}</Skeleton>
  ) : !showData ? (
    <Redacted
      SkeletonProps={{
        classes: {
          fitContent: classes.buttonLoading,
        },
      }}
      info={redacted ?? ''}
    >
      {btn}
    </Redacted>
  ) : (
    btn
  );
};
