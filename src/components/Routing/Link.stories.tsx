import { select, text } from '@storybook/addon-knobs';
import React, { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Link, LinkProps } from './Link';

export default {
  title: 'Components/Routing/Link',
  decorators: [(fn: () => ReactElement) => <MemoryRouter>{fn()}</MemoryRouter>],
};

export const Internal = () => <LinkStory to="/">Homepage</LinkStory>;

export const External = () => (
  <LinkStory external to="https://google.com" target="_blank">
    Google
  </LinkStory>
);

const LinkStory = (defaults: LinkProps) => (
  <Link
    {...defaults}
    to={text('To', defaults.to as string)}
    underline={select(
      'Underline',
      ['none', 'hover', 'always'],
      defaults.underline ?? 'hover'
    )}
    target={text('Target', defaults.target || '')}
  >
    {text('Label', defaults.children ? `${defaults.children}` : '')}
  </Link>
);
