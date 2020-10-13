import {
  Button,
  ButtonProps,
  makeStyles,
  TooltipProps,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { isFunction } from 'lodash';
import * as React from 'react';
import { ReactNode } from 'react';
import { Secured } from '../../api';
import { Redacted } from '../Redacted';

const useStyles = makeStyles(() => ({
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
}: ButtonProps & {
  loading?: boolean;
  secured?: Secured<T>;
  redacted?: TooltipProps['title'];
  children: ((value: T) => ReactNode) | ReactNode;
  empty?: ReactNode;
}) => {
  const classes = useStyles();
  const showData = !loading && (secured ? secured.canRead : true);

  const data = isFunction(children)
    ? showData && secured?.value
      ? children(secured.value) ?? empty
      : empty
    : children ?? empty;

  const btn = (
    <Button
      variant="outlined"
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
