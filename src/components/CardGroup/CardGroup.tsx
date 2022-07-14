import { Card, CardProps, makeStyles } from '@mui/material';
import clsx from 'clsx';
import { Children, Fragment } from 'react';
import { applyBreakpoint, BreakpointAt } from '~/common';
import { ResponsiveDivider } from '../ResponsiveDivider';

export interface CardGroupProps extends CardProps {
  horizontal?: BreakpointAt;
}

const useStyles = makeStyles(
  ({ breakpoints }) => ({
    root: (props: CardGroupProps) => ({
      display: 'flex',
      flexDirection: 'column',
      ...applyBreakpoint(breakpoints, props.horizontal, {
        flexDirection: 'row',
      }),
    }),
  }),
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
          {index % 2 ? (
            <ResponsiveDivider vertical={props.horizontal} spacing={2} />
          ) : null}
          {child}
        </Fragment>
      ))}
    </Card>
  );
};
