/**
 * Pure helpers for the responsive navigation in MainLayout.
 *
 * Extracted so they can be unit-tested in isolation without rendering the
 * full MainLayout (which depends on Apollo, auth, router, theme, etc.) —
 * matches the pattern used in LookupField.test.tsx.
 */
import { useCallback, useEffect, useState } from 'react';

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

/**
 * Owns the responsive nav state plus the resize-up dismiss guard.
 * Returned actions are stable by viewport so they can be threaded through
 * memoised props without forcing re-renders downstream.
 */
export const useNavOpenState = (isDesktop: boolean) => {
  const [navState, setNavState] = useState(initialNavOpenState);

  // If the viewport crosses up to desktop while the mobile drawer is open,
  // dismiss it so the Modal's focus trap / scroll lock don't linger
  // invisibly behind the desktop layout.
  useEffect(() => {
    if (isDesktop && navState.mobileOpen) {
      setNavState((prev) => ({ ...prev, mobileOpen: false }));
    }
  }, [isDesktop, navState.mobileOpen]);

  const handleToggle = useCallback(
    () => setNavState((prev) => toggleNavOpen(prev, isDesktop)),
    [isDesktop]
  );

  const closeMobile = useCallback(
    () => setNavState((prev) => ({ ...prev, mobileOpen: false })),
    []
  );

  return { navState, handleToggle, closeMobile };
};
