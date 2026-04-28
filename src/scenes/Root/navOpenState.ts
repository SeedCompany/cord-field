/**
 * Pure helpers for the responsive navigation in MainLayout.
 *
 * Extracted so they can be unit-tested in isolation without rendering the
 * full MainLayout (which depends on Apollo, auth, router, theme, etc.) —
 * matches the pattern used in LookupField.test.tsx.
 */

export interface NavOpenState {
  /** Whether the persistent desktop sidebar is expanded (md and up). */
  desktopOpen: boolean;
  /** Whether the temporary mobile drawer is showing (below md). */
  mobileOpen: boolean;
}

export const initialNavOpenState: NavOpenState = {
  desktopOpen: true,
  mobileOpen: false,
};

/**
 * Toggle the appropriate open flag based on the current viewport.
 *
 * Desktop and mobile each track their own open state so switching
 * viewports preserves the intent of the other mode.
 */
export const toggleNavOpen = (
  prev: NavOpenState,
  isDesktop: boolean
): NavOpenState =>
  isDesktop
    ? { ...prev, desktopOpen: !prev.desktopOpen }
    : { ...prev, mobileOpen: !prev.mobileOpen };
