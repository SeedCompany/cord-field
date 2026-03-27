# useDataGridSource

A React hook that connects a GraphQL-backed list to an MUI DataGrid Pro. It
handles server-side paging, incremental cache accumulation, and an automatic
switch to fully client-side filtering and sorting once every row has been
loaded.

---

## Non-technical overview

Every list screen in the app — Projects, Partners, Languages, etc. — shows a
table of rows. Those rows live on the server, often in the thousands, so the
app can't download them all at once. Instead it fetches one page at a time as
the user scrolls.

At the same time, filters and sorts the user applies need to feel instant.
Waiting for a server round-trip every time someone clicks a column header is
too slow. So the hook strikes a balance:

- **Before all rows are loaded:** sort and filter requests go to the server,
  which returns the right page.
- **After all rows are loaded** (either because the list is small, or because
  the user has scrolled through everything): the app switches to doing its
  own sorting and filtering in the browser, with no extra network calls.

The user's sort and filter choices are saved to `localStorage`, scoped to their
account, so they survive page refreshes and signing out and back in. When the
user comes back, the table reopens exactly as they left it.

---

## Architecture

Three files collaborate:

| File | Responsibility |
|---|---|
| `useViewState.ts` | What the user is looking at (sort column, filter values). Persists to `localStorage`. Converts UI state into GraphQL variables. |
| `useDataGridSource.tsx` | Orchestrator. Calls the two sub-hooks, handles sort/filter change events, and assembles the final props for `<DataGrid>`. |
| `useGridFilteredRowCount.ts` | Reactively reads how many rows pass the grid's current client-side filter, used for the "Total Rows" counter. |

```
useDataGridSource
├── useViewState          ← "what are we looking at?"
│   ├── localStorage      ← persist sort + filter across refreshes
│   └── GraphQL input     ← sort/filter → { sort, order, filter } for the query
├── useCachedList         ← "fetch it and keep it"
│   ├── allPages query    ← cache-only read of the accumulated full list
│   ├── firstPage query   ← live query for page 1 (current sort/filter)
│   ├── onFetchRows       ← triggered by scroll; fetches pages 2, 3, …
│   └── row stability     ← prevents blank flash during loading transitions
└── useGridFilteredRowCount ← reactive client-side row count
```

---

## useViewState

**What it owns:** sort model, filter model, localStorage persistence, and the
conversion of those UI values into the `{ sort, order, filter }` input the
GraphQL query expects.

### Storage key

The key is `<userId>:<operationName>-data-grid-view`, scoped to both the
authenticated user and the query name so different grids don't collide and
different users sharing a browser don't see each other's filters.
Example: `abc123:ProjectList-data-grid-view`.

### What is (and isn't) persisted

Only column types that make sense across sessions are saved:

- `singleSelect` columns (dropdown choices) — **persisted**
- `boolean` columns (yes/no toggles) — **persisted**
- Free-text columns — **not persisted** (partial strings often aren't useful
  after a break, and they can expose sensitive search terms in browser storage)

Sort state is always persisted.

### The `apiFilterModel` field

The stored object keeps a pre-computed `apiFilterModel` alongside the MUI
`filterModel`. This exists because on the very first render the DataGrid
hasn't mounted yet, so its API object isn't available to compute the filter
on the fly. The pre-computed version is used until the grid is ready.

### `apiSortModel` vs `sortModel`

The view tracks two sort models:

- `sortModel` — what the grid column headers show (always up to date).
- `apiSortModel` — what the first-page API query uses.

When the cache is complete and sorting is done client-side, `apiSortModel`
can be stale without issue — the server doesn't need to be asked again.
When the cache is not yet complete, `apiSortModel` is updated alongside
`sortModel` so the server query uses the current sort.

---

## useCachedList

**What it owns:** all Apollo interaction, page accumulation, and ensuring the
grid always has stable rows to display.

### The two cache queries

```
allPages      = cache-only read at variables (no filter)
allFilteredPages = cache-only read at variablesWithFilter (with filter, skipped when no filter)
```

Both are `fetchPolicy: 'cache-only'` — they never hit the network. They just
watch what's already in the Apollo cache.

### How pages accumulate

Every time a page arrives from the network (either the auto-fetched page 1, or
a scroll-triggered page), `addToAllPagesCache` writes it into the Apollo cache
under the `queryForItemRef` key. That key is a trimmed version of the query
that only requests `keyArgs` fields (e.g. `__typename` and `id`), keeping the
accumulated entry small.

The write merges the new items with any that were previously accumulated,
de-duplicating by Apollo cache identity. The `total` field is preserved from
whichever snapshot is authoritative (`updateTotal` flag).

### isCacheComplete

```ts
isCacheComplete = allPages.isComplete || allFilteredPages.isComplete
```

`isComplete` is true when `items.length === total`. Once either the unfiltered
or filtered full list is in cache, the grid switches to client modes for
`rowsLoadingMode`, `sortingMode`, and `filterMode`.

### Row stability (preventing blank flashes)

Loading transitions can leave the grid temporarily with no data. The fallback
chain resolves this:

```
freshList                           // prefer: current data if not mid-load
  ?? listFrom(prevFirstPage)        // Apollo's previousData during refetch
  ?? (loading ? prevListRef : null) // skip→active transition (no prevFirstPage)
  ?? { items: [], total: undefined } // last resort empty state
```

`prevListRef` is updated whenever a fresh list is available, covering the case
where switching from a fully-cached filter to an uncached one means Apollo's
`previousData` is undefined.

### Virtual scroll fetching

`onFetchRows` is called by DataGrid when the user scrolls near unloaded rows.
It is debounced (500 ms) to coalesce rapid scrolling. It:

1. Calculates which pages cover the visible row range.
2. Skips page 1 (always fetched by `useQuery`).
3. Fires `client.query()` for each page in parallel.
4. On success: calls `unstable_replaceRows` to swap in real data for the
   skeleton rows, and calls `addToAllPagesCache` to accumulate toward
   `isCacheComplete`.
5. Checks `isCurrent` before replacing rows — if sort or filter changed while
   the request was in flight, the rows are discarded (but the cache is still
   updated).

---

## Mode switching

The grid operates in one of two modes for filtering, sorting, and row loading:

| Mode | When | Behavior |
|---|---|---|
| `server` | `isCacheComplete = false` | DataGrid defers to the app; changes trigger new API queries |
| `client` | `isCacheComplete = true` | DataGrid handles everything in-browser with the full row set |

`paginationMode` is fixed to `server` when a total is known (preventing an
MUI warning) and `client` otherwise. It is intentionally not switched on
`isCacheComplete` — changing `paginationMode` dynamically causes DataGrid to
reset internally, which produces a visible flash.

### Applying client-side sort after cache completion

When `isCacheComplete` flips to `true`, the rows identity changes (switching
from the first-page slice to the full list). DataGrid doesn't automatically
re-sort when both `rows` and mode change at once, so there is an explicit
`useEffect` that calls `apiRef.current.applySorting()` when `isCacheComplete`
becomes true.

---

## Row count

```ts
rowCount = isCacheComplete
  ? filteredRowCount ?? rows.length
  : total
```

- In server mode, `total` comes from the API response.
- In client mode, `filteredRowCount` comes from `useGridFilteredRowCount`,
  which subscribes to the DataGrid's internal `stateChange` event via
  `useSyncExternalStore` and reads `gridFilteredTopLevelRowCountSelector`.
  This gives a live count that updates as filter values change, without any
  extra props or state coordination.

---

## Usage example

```tsx
const [dataGridProps] = useDataGridSource({
  query: ProjectListDocument,
  variables: { input: { filter: { status: ['Active'] } } },
  listAt: 'projects',
  initialInput: { sort: 'name', order: 'ASC', count: 50 },
});

return <DataGrid {...dataGridProps} columns={columns} />;
```

`listAt` is a dot-separated path into the query result where the
`{ items, total }` object lives. TypeScript enforces that the path resolves
to a valid `PaginatedListOutput` shape, so typos are caught at compile time.

