import { act, renderHook } from '@testing-library/react';
import {
  initialNavOpenState,
  NavOpenState,
  toggleNavOpen,
  useNavOpenState,
} from './navOpenState';

describe('navOpenState', () => {
  describe('initialNavOpenState', () => {
    it('defaults the desktop sidebar to open and the mobile drawer to closed', () => {
      expect(initialNavOpenState).toEqual({
        desktopOpen: true,
        mobileOpen: false,
      });
    });
  });

  describe('toggleNavOpen', () => {
    it('toggles only the desktop flag when isDesktop is true', () => {
      const prev: NavOpenState = { desktopOpen: true, mobileOpen: false };
      const next = toggleNavOpen(prev, true);
      expect(next).toEqual({ desktopOpen: false, mobileOpen: false });
    });

    it('toggles only the mobile flag when isDesktop is false', () => {
      const prev: NavOpenState = { desktopOpen: true, mobileOpen: false };
      const next = toggleNavOpen(prev, false);
      expect(next).toEqual({ desktopOpen: true, mobileOpen: true });
    });

    it('preserves the other viewport state across toggles', () => {
      // User opened the mobile drawer, then resized to desktop and toggled.
      const prev: NavOpenState = { desktopOpen: true, mobileOpen: true };
      const next = toggleNavOpen(prev, true);
      expect(next).toEqual({ desktopOpen: false, mobileOpen: true });
    });

    it('returns a new object (does not mutate the input)', () => {
      const prev: NavOpenState = { desktopOpen: true, mobileOpen: false };
      const next = toggleNavOpen(prev, true);
      expect(next).not.toBe(prev);
      expect(prev).toEqual({ desktopOpen: true, mobileOpen: false });
    });

    it('round-trips back to the original after two toggles in the same viewport', () => {
      const prev: NavOpenState = { desktopOpen: true, mobileOpen: false };
      const once = toggleNavOpen(prev, false);
      const twice = toggleNavOpen(once, false);
      expect(twice).toEqual(prev);
    });
  });

  describe('useNavOpenState', () => {
    it('starts with the initial state', () => {
      const { result } = renderHook(({ d }) => useNavOpenState(d), {
        initialProps: { d: false },
      });
      expect(result.current.navState).toEqual(initialNavOpenState);
    });

    it('toggles the active variant via handleToggle', () => {
      const { result, rerender } = renderHook(({ d }) => useNavOpenState(d), {
        initialProps: { d: false },
      });

      act(() => result.current.handleToggle());
      expect(result.current.navState).toEqual({
        desktopOpen: true,
        mobileOpen: true,
      });

      rerender({ d: true });
      act(() => result.current.handleToggle());
      // Resize-up dismiss collapses mobileOpen first, so desktop toggle
      // observes { desktop: true, mobile: false } and flips desktop to false.
      expect(result.current.navState).toEqual({
        desktopOpen: false,
        mobileOpen: false,
      });
    });

    it('dismisses the mobile drawer when the viewport crosses up to desktop', () => {
      // Start on mobile with the drawer closed.
      const { result, rerender } = renderHook(({ d }) => useNavOpenState(d), {
        initialProps: { d: false },
      });

      // User opens the mobile drawer.
      act(() => result.current.handleToggle());
      expect(result.current.navState.mobileOpen).toBe(true);

      // Window resize crosses up to desktop while drawer is still open —
      // the effect must dismiss it to avoid a leaked Modal focus trap.
      rerender({ d: true });
      expect(result.current.navState.mobileOpen).toBe(false);
      // Desktop intent is preserved (still open by default).
      expect(result.current.navState.desktopOpen).toBe(true);
    });

    it('does not touch desktopOpen when crossing breakpoints', () => {
      const { result, rerender } = renderHook(({ d }) => useNavOpenState(d), {
        initialProps: { d: true },
      });

      // User collapses the desktop sidebar.
      act(() => result.current.handleToggle());
      expect(result.current.navState.desktopOpen).toBe(false);

      // Resize down to mobile — desktop intent must persist.
      rerender({ d: false });
      expect(result.current.navState.desktopOpen).toBe(false);
    });

    it('closeMobile is a no-op when the drawer is already closed', () => {
      const { result } = renderHook(({ d }) => useNavOpenState(d), {
        initialProps: { d: false },
      });
      const before = result.current.navState;
      act(() => result.current.closeMobile());
      expect(result.current.navState).toEqual(before);
    });
  });
});
