import React, { ReactNode } from 'react';

interface Props {
  disabled?: boolean;
  children: ReactNode;
}

// TODO: Eliminate this component. It is here only as an example for storybook
export const Button = ({ disabled, children }: Props) => {
  return <button disabled={disabled}>{children}</button>;
};
