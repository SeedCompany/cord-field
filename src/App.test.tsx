import { render } from '@testing-library/react';
import { App } from './App';
import { TestContext } from './TestContext';

test('renders HOME', () => {
  const { getByRole } = render(
    <TestContext url="/">
      <App />
    </TestContext>
  );
  const spinner = getByRole('progressbar');
  expect(spinner).toBeInTheDocument();
});
