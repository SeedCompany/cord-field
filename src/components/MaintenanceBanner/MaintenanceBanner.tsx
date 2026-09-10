import {
  Close as CloseIcon,
  Engineering as MaintenanceIcon,
} from '@mui/icons-material';
import { Alert, AlertTitle, Collapse } from '@mui/material';
import { useLocalStorageState } from 'ahooks';
import { DateTime } from 'luxon';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ChildrenProp } from '~/common';
import { IconButton } from '../IconButton';

/**
 * The scheduled read-only maintenance window.
 *
 * To announce the next window, update `start`/`end`. When nothing is scheduled,
 * leave a past window in place (or drop `<MaintenanceBanner />` from
 * MainLayout) — the banner renders nothing once `end` has passed, so a stale
 * window is harmless if we forget.
 *
 * The window is anchored to `zone` rather than each viewer's local clock, so
 * everyone sees the same notice for the same period no matter where they are.
 */
const WINDOW = {
  zone: 'America/Chicago',
  /** Read-only begins. */
  start: '2026-09-17T17:00',
  /** Read-only ends — the banner hides itself after this. */
  end: '2026-09-17T21:00',
  /** How long before `start` the heads-up stops being dismissible. */
  lockInBefore: { hours: 1 },
  /**
   * Shortest time a dismissal is honoured. A dismissal normally lasts until the
   * next local day, so the notice re-nags once daily instead of being gone for
   * good — but without a floor, dismissing at 11:55pm would be undone five
   * minutes later. This carries a late-night dismissal through to the morning.
   */
  minQuiet: { hours: 8 },
};

/** Exported so tests can drive the phases off the configured window. */
export const maintenanceWindow = {
  start: DateTime.fromISO(WINDOW.start, { zone: WINDOW.zone }),
  end: DateTime.fromISO(WINDOW.end, { zone: WINDOW.zone }),
};
const { start, end } = maintenanceWindow;
const lockIn = start.minus(WINDOW.lockInBefore);

/**
 * `WINDOW` is hand-edited for each announcement, so a typo is the likely
 * failure. Without this, an unparseable date makes every comparison against
 * `NaN` false — which pins the phase to `upcoming` forever and ships
 * "Cord will be read-only Invalid DateTime" to everyone. Fail closed instead.
 */
const configured = start.isValid && end.isValid && end > start;
if (!configured) {
  console.error(
    `MaintenanceBanner: ignoring unusable window ${WINDOW.start} – ${WINDOW.end} (${WINDOW.zone})`
  );
}

/**
 * The banner is deliberately client-only. Every label below depends on the
 * viewer's timezone and the dismissal lives in localStorage — the server knows
 * neither. It would otherwise render the window in the *server's* zone, tell
 * the viewer that was "your time", and flash an already-dismissed notice on
 * every load. `createRoot` (not `hydrate`) means skipping SSR costs us nothing
 * but the first paint.
 */
const isClient = typeof window !== 'undefined';

/**
 * A date + time range, dropping the redundant halves — e.g.
 * "Thursday, September 17, 5:00–9:00 PM CDT", but
 * "Thursday, September 17, 11:00 PM–Friday, September 18, 3:00 AM GMT+1"
 * when the window straddles midnight in the viewer's zone.
 */
const formatWindow = (from: DateTime, to: DateTime) => {
  const sameDay = from.hasSame(to, 'day');
  const sameMeridiem = from.toFormat('a') === to.toFormat('a');
  const fromFmt =
    sameDay && sameMeridiem ? 'cccc, LLLL d, h:mm' : 'cccc, LLLL d, h:mm a';
  const toFmt = sameDay ? 'h:mm a ZZZZ' : 'cccc, LLLL d, h:mm a ZZZZ';
  return `${from.toFormat(fromFmt)}–${to.toFormat(toFmt)}`;
};

/** The canonical announcement, matching what goes out over email/Slack. */
const windowLabel = formatWindow(start, end);

/**
 * The same window in the viewer's own clock, for the (many) users outside
 * Central time. Omitted when their offset matches, so a Central viewer isn't
 * shown the same times twice.
 */
const localWindowLabel =
  start.toLocal().offset === start.offset
    ? undefined
    : formatWindow(start.toLocal(), end.toLocal());

/** The clock times the read-only period begins/ends, in the viewer's zone. */
const localStartTime = start.toLocal().toFormat('h:mm a ZZZZ');
const localEndTime = end.toLocal().toFormat('h:mm a ZZZZ');

/** Versioned by the window so a dismissal never carries into the next one. */
const dismissedKey = `maintenance-notice-dismissed-at:${WINDOW.start}`;

/** Re-check the clock this often so a long-open tab rolls over on its own. */
const tickInterval = 60_000;

type Phase = 'upcoming' | 'imminent' | 'active' | 'past';

const startMs = start.toMillis();
const endMs = end.toMillis();
const lockInMs = lockIn.toMillis();

const phaseAt = (now: number): Phase =>
  now >= endMs
    ? 'past'
    : now >= startMs
    ? 'active'
    : now >= lockInMs
    ? 'imminent'
    : 'upcoming';

/**
 * When a dismissal stops being honoured: the start of the next local day, but
 * never sooner than `minQuiet` after the click. Returns 0 when never dismissed.
 */
const resumeAfter = (dismissedAt: number) => {
  if (!dismissedAt) {
    return 0;
  }
  const at = DateTime.fromMillis(dismissedAt);
  return Math.max(
    at.plus({ days: 1 }).startOf('day').toMillis(),
    at.plus(WINDOW.minQuiet).toMillis()
  );
};

/**
 * Where a `<MaintenanceBanner />` is mounted. Surfaces that take over the whole
 * viewport — the progress report drawer, full-screen dialogs — sit in a portal
 * *above* the app shell, so the shell's banner is hidden behind them. Each such
 * surface renders its own banner at a higher layer, and only the top-most
 * mounted layer actually draws. Otherwise we'd either announce the notice twice
 * to a screen reader or, worse, show it only underneath the thing the user is
 * currently working in.
 */
const layers = { shell: 0, overlay: 1 };
export type MaintenanceLayer = keyof typeof layers;

interface Maintenance {
  phase: Phase;
  /** Whether the notice may be dismissed (only in the earliest phase). */
  dismissible: boolean;
  /** False while a dismissal is still being honoured — see `resumeAfter`. */
  undismissed: boolean;
  dismiss: () => void;
  claimLayer: (layer: MaintenanceLayer) => () => void;
  topLayer: number;
}

const MaintenanceContext = createContext<Maintenance | undefined>(undefined);

/**
 * Owns the maintenance clock and the dismissal, so every `<MaintenanceBanner />`
 * agrees — `useLocalStorageState` doesn't sync between hook instances, so
 * dismissing inside the report drawer would otherwise leave the shell's banner
 * showing once the drawer closed.
 */
export const MaintenanceProvider = ({ children }: ChildrenProp) => {
  const now = useNow();
  const phase = phaseAt(now);
  const [dismissedAt = 0, setDismissedAt] = useLocalStorageState<number>(
    dismissedKey,
    { defaultValue: 0 }
  );

  const [claims, setClaims] = useState<readonly number[]>([]);
  const claimLayer = useCallback((layer: MaintenanceLayer) => {
    const value = layers[layer];
    setClaims((prev) => [...prev, value]);
    return () =>
      setClaims((prev) => {
        const i = prev.indexOf(value);
        return i < 0 ? prev : [...prev.slice(0, i), ...prev.slice(i + 1)];
      });
  }, []);

  // Only the earliest phase can be dismissed, and only until the next local day.
  const dismissible = phase === 'upcoming';
  const dismiss = useCallback(
    () => setDismissedAt(DateTime.now().toMillis()),
    [setDismissedAt]
  );

  // Derived to a boolean before memoizing: `now` moves every minute, but the
  // context value must only change identity when something user-visible flips,
  // or every consumer re-renders on each tick for nothing.
  const undismissed = now >= resumeAfter(dismissedAt);

  const context = useMemo(
    (): Maintenance => ({
      phase,
      dismissible,
      undismissed,
      dismiss,
      claimLayer,
      topLayer: claims.length ? Math.max(...claims) : layers.shell,
    }),
    [phase, dismissible, undismissed, dismiss, claimLayer, claims]
  );

  return (
    <MaintenanceContext.Provider value={context}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export interface MaintenanceBannerProps {
  /**
   * Defaults to the app shell. Pass `overlay` from a surface that covers the
   * shell, so its banner wins over the one hidden behind it.
   */
  layer?: MaintenanceLayer;
}

/**
 * Announces the upcoming read-only maintenance window, escalating as it nears:
 *
 * - **> 1 hour out** — loud heads-up, dismissible once per day, so it nags
 *   without becoming wallpaper.
 * - **< 1 hour out** — same notice, no longer dismissible. Last call to save.
 * - **during** — a slim, quiet strip answering the only question that matters
 *   at that point: when can I save again?
 * - **after** — nothing.
 */
export const MaintenanceBanner = ({
  layer = 'shell',
}: MaintenanceBannerProps) => {
  const ctx = useContext(MaintenanceContext);
  const claimLayer = ctx?.claimLayer;

  useEffect(() => claimLayer?.(layer), [claimLayer, layer]);

  if (
    !configured ||
    !isClient ||
    !ctx ||
    ctx.phase === 'past' ||
    ctx.topLayer !== layers[layer]
  ) {
    return null;
  }

  const { phase, dismissible, undismissed, dismiss } = ctx;
  const show = !dismissible || undismissed;
  const active = phase === 'active';

  return (
    <Collapse
      in={show}
      unmountOnExit
      sx={{
        // flexShrink so the banner keeps its full height in the shell's flex
        // column instead of being squeezed when the copy wraps on narrow screens.
        flexShrink: 0,
        // Sticky belongs here, on the outermost node: Collapse's inner wrappers
        // hug the Alert's own height, so a sticky Alert would have no room to
        // move within them. This pins the banner to the top of a scrolling
        // overlay (the report drawer scrolls its own paper) and is a no-op in
        // the shell, which isn't a scroll container.
        position: 'sticky',
        top: 0,
        zIndex: 1,
      }}
    >
      <Alert
        // Remount on each phase change. Swapping `role` on a live node doesn't
        // re-announce, so without this the deliberately-assertive last call is
        // silent for screen readers on the long-open tab it exists to catch.
        key={phase}
        severity="warning"
        // Once it's just a standing condition, step down from the filled
        // attention-grabber to a quiet strip.
        variant={active ? 'standard' : 'filled'}
        icon={<MaintenanceIcon fontSize="inherit" />}
        // Assertive only for the newly-appearing last call; the others are
        // standing notices that shouldn't interrupt a screen reader.
        role={phase === 'imminent' ? 'alert' : 'status'}
        sx={{
          borderRadius: 0,
          alignItems: 'center',
          ...(active && { py: 0, borderBottom: 1, borderColor: 'divider' }),
        }}
        action={
          dismissible ? (
            <IconButton
              color="inherit"
              aria-label="Dismiss maintenance notice"
              onClick={dismiss}
            >
              <CloseIcon />
            </IconButton>
          ) : undefined
        }
      >
        {active ? (
          <>Cord is read-only for maintenance until {localEndTime}.</>
        ) : phase === 'imminent' ? (
          <>
            <AlertTitle>Cord goes read-only at {localStartTime}</AlertTitle>
            Maintenance starts in under an hour. Please save any in-progress
            work now — saving will be unavailable until {localEndTime}.
          </>
        ) : (
          <>
            <AlertTitle>Scheduled maintenance</AlertTitle>
            Cord will be read-only {windowLabel}
            {localWindowLabel && ` (${localWindowLabel} your time)`}. You'll be
            able to view and download everything as usual, but saving changes
            will be unavailable. Please save any in-progress work before{' '}
            {localStartTime}.
          </>
        )}
      </Alert>
    </Collapse>
  );
};

/**
 * The current time, re-read every minute so a tab left open escalates through
 * the phases on its own and a dismissal expires without a reload. Stops ticking
 * for good once the window has passed.
 */
const useNow = () => {
  const [now, setNow] = useState(() => DateTime.now().toMillis());
  const done = now >= endMs;

  useEffect(() => {
    if (done) {
      return; // Nothing left to roll over to.
    }
    const timer = setInterval(
      () => setNow(DateTime.now().toMillis()),
      tickInterval
    );
    return () => clearInterval(timer);
  }, [done]);

  return now;
};
