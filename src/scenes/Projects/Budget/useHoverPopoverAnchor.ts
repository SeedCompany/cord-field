import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * budget-line-items-poc: shared hover-popover anchor logic for the
 * "Language Engagements" / "Partners" header items.
 *
 * Both header items originally implemented this independently: a trigger
 * with `onMouseEnter`/`onMouseLeave` calling `setAnchorEl`/`setAnchorEl(null)`,
 * paired with a MUI `Popover` whose `slotProps.paper` had its own
 * `onMouseEnter`/`onMouseLeave` doing the same thing. That duplicated
 * pattern flickered badly: moving the mouse from the trigger toward the
 * popover's Paper (which is portaled elsewhere in the DOM, not laid out
 * flush against the trigger) reliably produces a real `mouseleave` on the
 * trigger -- since the cursor has genuinely left its bounding box -- before
 * the cursor reaches the Paper's own `mouseenter`. Because the trigger's
 * leave handler closed unconditionally and instantly, the Popover closed
 * (and, confirmed live, continued unmounting) before the Paper's own
 * `mouseenter` could rescue it, even when that `mouseenter` genuinely fired
 * on a still-interactive Paper -- reopening via the Paper's own hover did
 * not reliably recover the race once the close had already committed.
 *
 * Fix, part 1 (debounce): leaving either the trigger or the Paper
 * schedules a close after `CLOSE_DELAY_MS`; entering either one cancels
 * that pending close instead of racing a fresh, competing `setAnchorEl`
 * call against it. The anchor element is also now only ever set from the
 * trigger -- the Paper's hover no longer calls `setAnchorEl` on itself,
 * which previously re-anchored the Popover to its own Paper on every
 * re-entry (harmless-looking here only because the position happened not
 * to visibly move; it's still the wrong anchor semantically and a
 * needless second source of churn).
 *
 * That debounce reduced the flicker but did not eliminate it. Measuring
 * the trigger's and Paper's `getBoundingClientRect()` live showed the real
 * geometric gap between them is under 1px (`anchorOrigin: { vertical:
 * 'bottom', horizontal: 'left' }` against MUI's default `transformOrigin:
 * { vertical: 'top', horizontal: 'left' }` already places the Paper flush
 * against the trigger) -- so the gap was never the problem. The actual
 * remaining cause, confirmed by instrumenting real mouseover/mouseout
 * events: every MUI `Popover` mounts a Backdrop even when "invisible"
 * (it's how click-away-to-close works), and that Backdrop is a
 * `position: fixed`, full-viewport, `pointer-events: auto` element. Its
 * own `z-index: -1` only ranks it below the Paper *within the Modal's own
 * stacking context*; the Modal root itself still sits at
 * `theme.zIndex.modal` (1300), well above ordinary page content. So the
 * instant a popover opens, its Backdrop covers the trigger the popover is
 * anchored to. Browsers synthesize a real `mouseout`/`mouseover` pair
 * whenever the topmost element under an already-stationary cursor changes
 * -- no mouse movement required -- so the trigger receives a genuine
 * `mouseleave` (relatedTarget = the Backdrop) within a few ms of every
 * open. That arms `scheduleClose` regardless of where the cursor actually
 * is. If the cursor hasn't (really) reached the Paper by the time the
 * timer fires, the popover closes for real, the Backdrop unmounts, and --
 * if the cursor is still resting where the trigger visually is, which it
 * usually is, since it never had to move -- a fresh phantom `mouseover`
 * reopens it. That close/reopen cycle then free-runs on the timer alone;
 * confirmed live, it repeats indefinitely with the cursor held perfectly
 * still. This is what survived the debounce: the debounce only guards
 * against races from *real* cursor motion, not a close/reopen loop that
 * needs no motion at all.
 *
 * Fix, part 2 (kill the phantom event at its source) -- this took two
 * tries, both confirmed live by instrumenting real mouseover/mouseout
 * events with the fix in place and watching what `relatedTarget` actually
 * was:
 *
 * Attempt A: give the Backdrop itself `pointer-events: none` via
 * `rootProps`. This did NOT fully fix it -- live instrumentation still
 * showed a phantom `mouseout` on the trigger the instant the popover
 * opened, with `relatedTarget` now the `.MuiModal-root` /
 * `.MuiPopover-root` element itself (confirmed by class name), not the
 * Backdrop. Checked `Modal.js`: the Backdrop is only ONE child of that
 * root div. The root div itself (`ModalRoot`, styled('div')) is
 * independently `position: fixed; inset: 0; z-index: theme.zIndex.modal`
 * -- its own full-viewport box, with `pointer-events` left at the CSS
 * default (`auto`). Making only the Backdrop non-interactive still left
 * this second, separate full-viewport element (its parent) sitting above
 * the page and catching the hit-test the instant it mounted.
 *
 * Attempt B (the actual fix): set `pointer-events: none` on the root
 * itself via `rootProps.sx`, not just the Backdrop. Since `pointer-events`
 * is an inherited CSS property, this also cascades to the Backdrop and
 * the Paper -- so the Paper (which must stay genuinely interactive, since
 * users hover/click its content) has to explicitly opt back in with its
 * own `pointer-events: auto`. That's why `paperProps.sx` below sets
 * `pointerEvents: 'auto'` -- each consumer must merge it into their
 * Paper's own `sx` (spread `paperProps.sx` before their own overrides, not
 * after, since a naive `{ ...paperProps, sx: {...} }` would silently drop
 * this and reintroduce the exact bug this fixes). The Backdrop-level
 * override from attempt A is kept as harmless, self-documenting
 * defense-in-depth; it's now redundant with the inherited `none` from the
 * root but costs nothing to leave in.
 *
 * With the whole Modal root out of hit-testing (Paper excepted), opening
 * or closing the popover never again changes what's "under" a stationary
 * cursor, and the free-running loop above cannot start. `CLOSE_DELAY_MS`
 * is now a small safety margin for genuinely brief accidental micro-exits
 * (e.g. the cursor landing exactly on the sub-pixel seam between trigger
 * and Paper), not the mechanism papering over the loop -- so it's been
 * turned down from 200ms accordingly. Losing the Backdrop's click-away
 * hit-testing is fine for a hover popover: leaving via hover already
 * closes it, and Escape still closes it through `onClose` / `close()`,
 * neither of which depend on the Backdrop.
 *
 * `rootProps` (not `backdropProps`): this installed MUI version (5.15)
 * only exposes `paper` and `root` on `Popover`'s own `slotProps` --
 * there's no `slotProps.backdrop` on `Popover` directly yet. `slotProps.root`
 * forwards to the underlying `Modal` (`PopoverRoot` is literally
 * `styled(Modal, ...)`), and `Modal` *does* have its own `slotProps.backdrop`
 * plus its own `sx`, so that's the layer we have to reach through. Confirmed
 * against `Popover.js`: it already sets its own internal
 * `additionalProps.slotProps.backdrop = { invisible: true }` when building
 * the root's props, so ours must preserve `invisible: true` alongside the
 * `pointerEvents: 'none'` we're adding, rather than assume it survives a
 * merge untouched.
 */

const CLOSE_DELAY_MS = 100;

export interface HoverPopoverAnchor {
  anchorEl: HTMLElement | null;
  open: boolean;
  /** Spread onto the clickable/hoverable trigger element. */
  triggerProps: {
    onMouseEnter: (event: MouseEvent<HTMLElement>) => void;
    onMouseLeave: () => void;
    onClick: (event: MouseEvent<HTMLElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  };
  /** Spread onto the Popover's `slotProps.paper` -- merge `sx` in, don't
   * overwrite it (see the doc comment above): the `pointerEvents: 'auto'`
   * here is what makes the Paper interactive again after `rootProps` below
   * turns off pointer-events for the whole Modal root it inherits from. */
  paperProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    sx: { pointerEvents: 'auto' };
  };
  /** Spread onto the Popover's `slotProps.root` -- reaches through to the
   * underlying Modal to take its root element (and, by CSS inheritance,
   * the Backdrop) out of hit-testing entirely (see the doc comment above
   * for why both layers -- root and Backdrop -- matter here, and why this
   * has to go through `root` rather than a direct `backdrop` slot). */
  rootProps: {
    sx: { pointerEvents: 'none' };
    slotProps: {
      backdrop: {
        invisible: true;
        sx: { pointerEvents: 'none' };
      };
    };
  };
  /** Wire to the Popover's `onClose` (e.g. Escape key). */
  close: () => void;
}

export const useHoverPopoverAnchor = (): HoverPopoverAnchor => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const clearPendingClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearPendingClose();
    closeTimer.current = setTimeout(() => {
      closeTimer.current = undefined;
      setAnchorEl(null);
    }, CLOSE_DELAY_MS);
  }, [clearPendingClose]);

  const openAt = useCallback(
    (el: HTMLElement) => {
      clearPendingClose();
      setAnchorEl(el);
    },
    [clearPendingClose]
  );

  const close = useCallback(() => {
    clearPendingClose();
    setAnchorEl(null);
  }, [clearPendingClose]);

  // Don't leave a dangling timer if the component unmounts mid-delay.
  useEffect(() => clearPendingClose, [clearPendingClose]);

  const onTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openAt(event.currentTarget);
      }
    },
    [openAt]
  );

  return {
    anchorEl,
    open: Boolean(anchorEl),
    triggerProps: {
      onMouseEnter: (e) => openAt(e.currentTarget),
      onMouseLeave: scheduleClose,
      onClick: (e) => openAt(e.currentTarget),
      onKeyDown: onTriggerKeyDown,
    },
    paperProps: {
      // Cancel the pending close -- do NOT re-anchor to the Paper itself.
      onMouseEnter: clearPendingClose,
      onMouseLeave: scheduleClose,
      // Opt back in to pointer events -- see the doc comment above.
      sx: { pointerEvents: 'auto' },
    },
    rootProps: {
      // Out of hit-testing entirely -- see the doc comment above. This is
      // the Modal root itself (not just its Backdrop child): that root is
      // its OWN separate full-viewport `position: fixed` box, so making
      // only the Backdrop non-interactive wasn't enough.
      sx: { pointerEvents: 'none' },
      slotProps: {
        // Redundant with the inherited `none` from the root above, but
        // kept as explicit defense-in-depth. `invisible: true` preserved:
        // it's what Popover itself defaults the Backdrop to, and we're
        // overriding this slot wholesale.
        backdrop: { invisible: true, sx: { pointerEvents: 'none' } },
      },
    },
    close,
  };
};
