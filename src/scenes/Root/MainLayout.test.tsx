import { createTheme, ThemeProvider } from '@mui/material/styles';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MainLayout } from './MainLayout';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet" />,
  };
});

jest.mock('~/components/Comments/CommentsBar', () => ({
  CommentsBar: () => <div data-testid="comments-bar" />,
}));

jest.mock('../Authentication', () => ({
  useAuthRequired: () => undefined,
}));

jest.mock('./Creates', () => ({
  CreateDialogProviders: ({ children }: { children?: ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('./Header', () => ({
  Header: ({
    onMenuClick,
    navOpen,
  }: {
    onMenuClick?: () => void;
    navOpen?: boolean;
  }) => (
    <button
      type="button"
      aria-label="toggle navigation menu"
      aria-expanded={navOpen}
      onClick={onMenuClick}
    >
      Toggle Nav
    </button>
  ),
}));

jest.mock('./Sidebar', () => ({
  SIDEBAR_WIDTH: 248,
  Sidebar: ({ open }: { open: boolean }) => (
    <div data-testid="desktop-sidebar" data-open={String(open)} />
  ),
  SidebarContent: ({ onNavigate }: { onNavigate?: () => void }) => (
    <button type="button" data-testid="mobile-nav-item" onClick={onNavigate}>
      Navigate
    </button>
  ),
}));

interface MatchMediaChangeEvent {
  matches: boolean;
  media: string;
}

type MediaQueryListener = (event: MatchMediaChangeEvent) => void;

const listeners = new Set<MediaQueryListener>();
let isDesktop = false;

const emitMediaChange = () => {
  const event: MatchMediaChangeEvent = {
    matches: isDesktop,
    media: '(min-width:900px)',
  };

  act(() => {
    listeners.forEach((listener) => listener(event));
  });
};

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      media: query,
      get matches() {
        return isDesktop;
      },
      onchange: null,
      addListener: (listener: MediaQueryListener) => listeners.add(listener),
      removeListener: (listener: MediaQueryListener) =>
        listeners.delete(listener),
      addEventListener: (_event: 'change', listener: MediaQueryListener) =>
        listeners.add(listener),
      removeEventListener: (_event: 'change', listener: MediaQueryListener) =>
        listeners.delete(listener),
      dispatchEvent: () => true,
    })),
  });
});

const renderMainLayout = () =>
  render(
    <ThemeProvider theme={createTheme()}>
      <MainLayout />
    </ThemeProvider>
  );

describe('MainLayout', () => {
  const getMenuToggle = () =>
    screen.getByRole('button', {
      name: 'toggle navigation menu',
      hidden: true,
    });

  beforeEach(() => {
    isDesktop = false;
    listeners.clear();
  });

  it('resets mobile drawer state after crossing to desktop and back', async () => {
    const user = userEvent.setup();
    const { rerender } = renderMainLayout();

    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'false');

    await user.click(getMenuToggle());
    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'true');

    isDesktop = true;
    emitMediaChange();
    rerender(
      <ThemeProvider theme={createTheme()}>
        <MainLayout />
      </ThemeProvider>
    );

    // Desktop sidebar starts open.
    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'true');

    isDesktop = false;
    emitMediaChange();
    rerender(
      <ThemeProvider theme={createTheme()}>
        <MainLayout />
      </ThemeProvider>
    );

    // Mobile drawer state should have been cleared while on desktop.
    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the mobile drawer when a nav item is clicked', async () => {
    const user = userEvent.setup();
    renderMainLayout();

    await user.click(getMenuToggle());
    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'true');

    const navItem = await screen.findByTestId('mobile-nav-item');
    await user.click(navItem);

    expect(getMenuToggle()).toHaveAttribute('aria-expanded', 'false');
  });
});
