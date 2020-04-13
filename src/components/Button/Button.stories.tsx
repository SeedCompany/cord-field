import React from 'react';
import { Button } from '.';

export default { title: 'Button' };

export const withText = () => <Button>Hello I'm a button</Button>;

export const withDisabledProp = () => (
  <Button disabled>Hello, I'm a disabled button</Button>
);
