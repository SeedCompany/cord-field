import { act, fireEvent, render, screen } from '@testing-library/react';
import { Settings } from 'luxon';
import { ReactNode } from 'react';
import {
  MaintenanceBanner,
  MaintenanceProvider,
  maintenanceWindow,
} from './MaintenanceBanner';

// Drive the clock off the configured window so these stay valid when the next
// maintenance window is scheduled.
const at = (millis: number) => {
  Settings.now = () => millis;
};
const hour = 60 * 60 * 1000;
const day = 24 * hour;

const { start, end } = maintenanceWindow;
const dismissBtn = { name: 'Dismiss maintenance notice' };

const inProvider = (children: ReactNode) => (
  <MaintenanceProvider>{children}</MaintenanceProvider>
);

const setup = () => render(inProvider(<MaintenanceBanner />));

const dismiss = () => {
  const { unmount } = setup();
  fireEvent.click(screen.getByRole('button', dismissBtn));
  unmount();
};

describe('MaintenanceBanner', () => {
  afterEach(() => {
    Settings.now = () => Date.now();
    localStorage.clear();
  });

  it('announces the upcoming window ahead of time', () => {
    at(start.toMillis() - 3 * day);
    setup();
    const banner = screen.getByRole('status');
    expect(banner).toHaveTextContent(/Cord will be read-only/);
    // The canonical (Central) window is always spelled out, whatever zone the
    // viewer — or CI — happens to be in.
    expect(banner).toHaveTextContent(start.toFormat('cccc, LLLL d, h:mm'));
    expect(banner).toHaveTextContent(end.toFormat('h:mm a'));
  });

  describe('a dismissal', () => {
    // 9am, three days out — comfortably in the `upcoming` phase, and far enough
    // from midnight that `minQuiet` isn't what's holding the notice back.
    const morning = start
      .toLocal()
      .minus({ days: 3 })
      .set({ hour: 9, minute: 0, second: 0, millisecond: 0 });

    it('holds for the rest of the day', () => {
      at(morning.toMillis());
      dismiss();

      at(morning.plus({ hours: 8 }).toMillis());
      setup();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('expires when the local day rolls over', () => {
      at(morning.toMillis());
      dismiss();

      at(
        morning.plus({ days: 1 }).startOf('day').plus({ minutes: 1 }).toMillis()
      );
      setup();
      expect(screen.getByRole('status')).toHaveTextContent(
        /Cord will be read-only/
      );
    });

    it('survives midnight when made late at night', () => {
      // The wart in a purely date-scoped dismissal: this one is only five
      // minutes from the next local day.
      const lateNight = morning.set({ hour: 23, minute: 55 });
      at(lateNight.toMillis());
      dismiss();

      // Half an hour later it's technically "tomorrow", but re-nagging now
      // would make the dismiss button useless.
      at(lateNight.plus({ minutes: 35 }).toMillis());
      setup();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('expires in the morning after a late-night dismissal', () => {
      const lateNight = morning.set({ hour: 23, minute: 55 });
      at(lateNight.toMillis());
      dismiss();

      at(lateNight.plus({ hours: 8, minutes: 5 }).toMillis());
      setup();
      expect(screen.getByRole('status')).toHaveTextContent(
        /Cord will be read-only/
      );
    });
  });

  it('locks in within the last hour, ignoring an earlier dismissal', () => {
    at(start.toMillis() - 3 * day);
    dismiss();

    at(start.toMillis() - hour / 2);
    setup();
    expect(screen.getByRole('alert')).toHaveTextContent(
      /Maintenance starts in under an hour/
    );
    expect(screen.queryByRole('button', dismissBtn)).not.toBeInTheDocument();
  });

  it('shows a quiet read-only notice during the window', () => {
    at(start.toMillis() - 3 * day);
    dismiss();

    at(start.toMillis() + hour);
    setup();
    expect(screen.getByRole('status')).toHaveTextContent(
      `Cord is read-only for maintenance until ${end
        .toLocal()
        .toFormat('h:mm a ZZZZ')}.`
    );
    expect(screen.queryByRole('button', dismissBtn)).not.toBeInTheDocument();
  });

  it('renders nothing after the window has passed', () => {
    at(end.toMillis() + day);
    setup();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('ships a usable window — a typo would reach every user', () => {
    // `WINDOW` is hand-edited per announcement, and an unparseable date is
    // silent: every comparison against NaN is false, so the phase would stick
    // on `upcoming` and the copy would read "Invalid DateTime".
    expect(start.isValid).toBe(true);
    expect(end.isValid).toBe(true);
    expect(end.toMillis()).toBeGreaterThan(start.toMillis());
  });

  describe('layers', () => {
    // A takeover surface (the progress report drawer) covers the app shell, so
    // only its own banner should draw — otherwise the notice is stranded behind
    // the very thing the user is working in.
    const bothLayers = (
      <>
        <div data-testid="shell">
          <MaintenanceBanner />
        </div>
        <div data-testid="overlay">
          <MaintenanceBanner layer="overlay" />
        </div>
      </>
    );

    it('draws in an overlay instead of the shell behind it', () => {
      at(start.toMillis() - 3 * day);
      render(inProvider(bothLayers));

      expect(screen.getByTestId('shell')).toBeEmptyDOMElement();
      expect(screen.getByTestId('overlay')).toHaveTextContent(
        /Cord will be read-only/
      );
      // Exactly one notice, so a screen reader doesn't hear it twice.
      expect(screen.getAllByRole('status')).toHaveLength(1);
    });

    it('draws in the shell again once the overlay closes', () => {
      at(start.toMillis() - 3 * day);
      const { rerender } = render(inProvider(bothLayers));
      expect(screen.getByTestId('shell')).toBeEmptyDOMElement();

      rerender(
        inProvider(
          <div data-testid="shell">
            <MaintenanceBanner />
          </div>
        )
      );
      expect(screen.getByTestId('shell')).toHaveTextContent(
        /Cord will be read-only/
      );
    });

    it('shares the dismissal across layers', () => {
      jest.useFakeTimers();
      at(start.toMillis() - 3 * day);
      const { rerender } = render(inProvider(bothLayers));

      // Dismiss from the overlay — the only layer currently drawing.
      fireEvent.click(screen.getByRole('button', dismissBtn));

      // Close the overlay. The shell takes over and must already agree that the
      // notice was dismissed; `useLocalStorageState` alone wouldn't have told it.
      rerender(
        inProvider(
          <div data-testid="shell">
            <MaintenanceBanner />
          </div>
        )
      );
      act(() => void jest.advanceTimersByTime(1000)); // let the collapse finish
      expect(screen.getByTestId('shell')).toBeEmptyDOMElement();
      jest.useRealTimers();
    });
  });
});
