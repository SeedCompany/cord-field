import { Button, ButtonProps, Skeleton, TooltipProps } from '@mui/material';
import { isFunction } from 'lodash';
import { ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';
import { SecuredProp } from '~/common';
import { Redacted } from '../Redacted';

const useStyles = makeStyles()(() => ({
  buttonLoading: {
    maxWidth: 'initial',
  },
}));

export const DataButton = <T extends any>({
  loading,
  secured,
  empty,
  redacted,
  children,
  startIcon,
  ...props
}: Omit<ButtonProps, 'children'> & {
  loading?: boolean;
  secured?: SecuredProp<T>;
  redacted?: TooltipProps['title'];
  children: ((value: T) => ReactNode) | ReactNode;
  empty?: ReactNode;
}) => {
  const { classes } = useStyles();
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
      startIcon={showData ? startIcon : undefined}
    >
      {data || <>&nbsp;</>}
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
