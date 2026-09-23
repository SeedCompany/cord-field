import { loadLoadableById } from './loadable';

declare global {
  interface Window {
    /**
     * The loadable ids the server rendered, written into the page by
     * `indexHtml`. Source ids, not chunk URLs.
     */
    __LOADABLE_IDS__?: readonly string[];
  }
}

/**
 * Load every module the server rendered before the client renders, so the
 * first client render matches the server's markup without a fallback flash.
 * A drop-in for the `loadable-components` library's `loadableReady`.
 *
 * No manifest is read, deliberately: the server sends *source* ids, we look
 * each one up in the registry and call the `import()` it registered, and
 * Rollup's `__vitePreload` inside that import already knows the real chunk
 * URLs. A wrong manifest would cost preload hints, never correctness.
 *
 * This loops rather than making a single pass. An id may not be in the
 * registry yet: `ProjectOverview` is declared inside `Projects.tsx`, so it
 * registers only once `Projects.tsx` itself has been evaluated — which is what
 * loading the `Projects` id does. Keep going until a pass loads nothing new.
 */
export const loadableReady = async (maxPasses = 20) => {
  if (typeof window === 'undefined') {
    return;
  }
  const ids = window.__LOADABLE_IDS__ ?? [];
  const started = new Set<string>();

  let passes = 0;
  while (passes < maxPasses) {
    passes++;
    const loading = ids.flatMap((id) => {
      if (started.has(id)) {
        return [];
      }
      const promise = loadLoadableById(id);
      if (!promise) {
        // Not registered yet; a later pass may find it.
        return [];
      }
      started.add(id);
      return [promise];
    });
    if (loading.length === 0) {
      // Nothing new to do. Any ids left unresolved are ones no module
      // registered, which only costs those chunks a round trip.
      return;
    }
    await Promise.allSettled(loading);
  }
};
