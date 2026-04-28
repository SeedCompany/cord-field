import {
  initialNavOpenState,
  NavOpenState,
  toggleNavOpen,
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
});
