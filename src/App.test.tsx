import { render } from '@testing-library/react';
import React from 'react';
import { App } from './App';

test('renders HOME', () => {
  const { getByRole } = render(<App />);
  const spinner = getByRole('progressbar');
  expect(spinner).toBeInTheDocument();
});
