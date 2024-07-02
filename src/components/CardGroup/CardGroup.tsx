import { Card, CardProps } from '@mui/material';
import { Children, Fragment } from 'react';
import { applyBreakpoint, BreakpointAt, extendSx } from '~/common';
import { ResponsiveDivider } from '../ResponsiveDivider';

export interface CardGroupProps extends CardProps {
  horizontal?: BreakpointAt;
}

export const CardGroup = ({ horizontal, ...props }: CardGroupProps) => (
  <Card
    {...props}
    sx={[
      (theme) => ({
        display: 'flex',
        flexDirection: 'column',
        ...applyBreakpoint(theme.breakpoints, horizontal, {
          flexDirection: 'row',
        }),
      }),
      ...extendSx(props.sx),
    ]}
  >
    {Children.map(props.children, (child, index) => (
      <Fragment key={index}>
        {index % 2 ? (
          <ResponsiveDivider vertical={horizontal} spacing={2} />
        ) : null}
        {child}
      </Fragment>
    ))}
  </Card>
);
