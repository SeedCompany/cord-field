import { Card, CardProps } from '@mui/material';
import { Children, ComponentType, Fragment } from 'react';
import { withStyles } from 'tss-react/mui';
import { applyBreakpoint, BreakpointAt } from '~/common';
import { ResponsiveDivider } from '../ResponsiveDivider';

export interface CardGroupProps extends CardProps {
  horizontal?: BreakpointAt;
}

const CardGroupRoot = withStyles(
  Card as ComponentType<CardGroupProps>,
  ({ breakpoints }, props: CardGroupProps) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      ...applyBreakpoint(breakpoints, props.horizontal, {
        flexDirection: 'row',
      }),
    },
  })
);

export const CardGroup = (props: CardGroupProps) => {
  const { children, ...rest } = props;
  return (
    <CardGroupRoot {...rest}>
      {Children.map(children, (child, index) => (
        <Fragment key={index}>
          {index % 2 ? (
            <ResponsiveDivider vertical={props.horizontal} spacing={2} />
          ) : null}
          {child}
        </Fragment>
      ))}
    </CardGroupRoot>
  );
};
