import { TabContext } from '@mui/lab';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useIsMobile } from '~/common';
import { TabList } from './TabList';

jest.mock('~/common', () => ({
  ...jest.requireActual('~/common'),
  useIsMobile: jest.fn(),
}));
const mockUseIsMobile = useIsMobile as jest.Mock;

// TabList reads value/label/to off its children's props (it doesn't render them
// in mobile mode), so a props-only stand-in is sufficient.
const Tab = (_: { value: string; label: string; to?: string }) => null;

const LocationProbe = () => {
  const { pathname } = useLocation();
  return <div data-testid="pathname">{pathname}</div>;
};

const renderTabs = () =>
  render(
    <MemoryRouter initialEntries={['/projects']}>
      <TabContext value="/projects">
        <TabList aria-label="tabs">
          <Tab value="/projects" label="Projects" to="/projects" />
          <Tab value="/engagements" label="Engagements" to="/engagements" />
        </TabList>
      </TabContext>
      <LocationProbe />
    </MemoryRouter>
  );

describe('TabList (mobile)', () => {
  beforeEach(() => mockUseIsMobile.mockReturnValue(true));

  it('renders a select instead of tabs', async () => {
    renderTabs();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    // current tab shown
    expect(await screen.findByText('Projects')).toBeInTheDocument();
  });

  it('navigates when a route-based tab is selected', async () => {
    renderTabs();
    expect(screen.getByTestId('pathname')).toHaveTextContent('/projects');

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'Engagements' }));

    await waitFor(() =>
      expect(screen.getByTestId('pathname')).toHaveTextContent('/engagements')
    );
  });
});
