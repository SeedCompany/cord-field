import { Card, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Children, ComponentType, Fragment } from 'react';
import { applyBreakpoint, BreakpointAt } from '~/common';
import { ResponsiveDivider } from '../ResponsiveDivider';

export interface CardGroupProps extends CardProps {
  horizontal?: BreakpointAt;
}

const CardGroupRoot = styled(Card as ComponentType<CardGroupProps>)(
  ({ horizontal, theme }) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      ...applyBreakpoint(theme.breakpoints, horizontal, {
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
