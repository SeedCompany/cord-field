import { addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { HashRouter } from 'react-router-dom';
import React, { createElement, Fragment } from 'react';
import { appProviders } from '../src/App';
import { Nest } from '../src/components/Nest';
import { SessionProvider } from '../src/components/Session';

// Do hacking to show dates easier
import '../src/util/CalenderDate';
import '../src/util/hacky-inspect-dates';

addDecorator(withInfo);

const storybookProviders = [
  createElement(HashRouter),
  ...appProviders,
  createElement(SessionProvider, { user: null }),
];

addDecorator(story => {
  // render story with contexts provided here.
  // if story fn is called directly it won't be a child the providers
  // defined here and thus contexts will not be provided.
  const Story = () => createElement(Fragment, {}, story());

  return createElement(
    Nest,
    { elements: storybookProviders },
    createElement(Story),
  );
});

addParameters({
  options: {
    showRoots: true,
  },
});
