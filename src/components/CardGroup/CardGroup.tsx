import { Card, CardProps, Divider, makeStyles } from '@material-ui/core';
// eslint-disable-next-line no-restricted-imports
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
// eslint-disable-next-line no-restricted-imports
import { CSSProperties } from '@material-ui/styles';
import clsx from 'clsx';
import { isString } from 'lodash';
import * as React from 'react';
import { Children, Fragment } from 'react';

export interface CardGroupProps extends CardProps {
  horizontal?: Breakpoint | boolean;
}

const useStyles = makeStyles(
  ({ spacing, breakpoints }) => {
    const applyHorizontal = (
      { horizontal }: CardGroupProps,
      css: CSSProperties
    ) =>
      isString(horizontal)
        ? { [breakpoints.up(horizontal)]: css }
        : horizontal
        ? css
        : {};
    return {
      root: (props: CardGroupProps) => ({
        display: 'flex',
        flexDirection: 'column',
        ...applyHorizontal(props, {
          flexDirection: 'row',
        }),
      }),
      divider: (props: CardGroupProps) => ({
        margin: spacing(0, 2),
        ...applyHorizontal(props, {
          margin: spacing(2, 0),
          // Divider orientation=vertical & flexItem
          width: 1,
          height: 'auto',
          alignSelf: 'stretch',
        }),
      }),
    };
  },
  {
    classNamePrefix: 'CardGroup',
  }
);

export const CardGroup = (props: CardGroupProps) => {
  const { children, ...rest } = props;
  const classes = useStyles(props);

  return (
    <Card {...rest} className={clsx(classes.root, rest.className)}>
      {Children.map(children, (child, index) => (
        <Fragment key={index}>
          {index % 2 ? <Divider className={classes.divider} /> : null}
          {child}
        </Fragment>
      ))}
    </Card>
  );
};
