import { useMemo } from 'react';
import { makeQueryHandler, StringParam, withDefault } from './useQueryParams';

const useTabFilter = makeQueryHandler({
  tab: withDefault(StringParam, 'profile'),
});

/**
 * Manages URL-synced tab state for detail pages.
 *
 * Falls back to the default tab synchronously during render if the current
 * URL value isn't in the available tab list, avoiding the one-frame flicker
 * caused by the useEffect/reset pattern.
 *
 * @param availableTabs - The tab values that are currently accessible.
 *   Tabs that aren't readable (e.g. due to permissions) should be excluded.
 *   Always include 'profile' (or whatever your default is) in this list.
 * @param defaultTab - The tab to fall back to. Defaults to 'profile'.
 *
 * @example
 * const [tab, setTab] = useDetailTabs([
 *   'profile',
 *   ...(canReadProjects ? ['projects'] : []),
 * ]);
 */
export const useDetailTabs = (
  availableTabs: readonly string[],
  defaultTab = 'profile'
) => {
  const [filters, setFilters] = useTabFilter();

  const activeTab = useMemo(
    () => (availableTabs.includes(filters.tab) ? filters.tab : defaultTab),
    [availableTabs, filters.tab, defaultTab]
  );

  const setTab = (tab: string) => setFilters({ tab });

  return [activeTab, setTab] as const;
};
