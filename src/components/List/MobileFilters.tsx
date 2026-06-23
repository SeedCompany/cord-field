import { Close as CloseIcon, FilterList } from '@mui/icons-material';
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  Drawer,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useDebounce } from 'ahooks';
import { mergeWith } from 'lodash';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { IconButton } from '../IconButton';
import {
  FilterControl,
  SortConfig,
  SortDirection,
  SortOption,
  SortState,
} from './gridColumnAdapters';

type FilterValues = Record<string, unknown>;

interface MobileFilterState {
  controls: readonly FilterControl[];
  values: FilterValues;
  setValue: (key: string, value: unknown) => void;
  clearAll: () => void;
  register: (
    controls: readonly FilterControl[],
    sort?: SortConfig & { key: string }
  ) => void;
  unregister: () => void;
  sortOptions: readonly SortOption[];
  sort?: SortState;
  /** True when the active sort differs from the list's default (so "Clear all" has work to do). */
  sortDirty: boolean;
  /** Identifies which registered list `sort` belongs to (see {@link useRowListFilters}). */
  sortKey: string;
  setSort: (sort: SortState) => void;
}

const MobileFilterContext = createContext<MobileFilterState | null>(null);

/**
 * Holds the active list's filter controls + values so the global header filter
 * button can render and drive them. Lives in the app shell (wraps Header + content).
 */
export const MobileFilterProvider = ({ children }: { children: ReactNode }) => {
  const [controls, setControls] = useState<readonly FilterControl[]>([]);
  const [values, setValues] = useState<FilterValues>({});
  const [sortOptions, setSortOptions] = useState<readonly SortOption[]>([]);
  const [sort, setSort] = useState<SortState | undefined>(undefined);
  const [sortKey, setSortKey] = useState('');
  const [defaultSort, setDefaultSort] = useState<SortState | undefined>(
    undefined
  );

  const register = useCallback<MobileFilterState['register']>(
    (next, sortCfg) => {
      setControls(next);
      setValues({});
      setSortOptions(sortCfg?.options ?? []);
      setSort(sortCfg?.default);
      setDefaultSort(sortCfg?.default);
      setSortKey(sortCfg?.key ?? '');
    },
    []
  );
  const unregister = useCallback(() => {
    setControls([]);
    setValues({});
    setSortOptions([]);
    setSort(undefined);
    setDefaultSort(undefined);
    setSortKey('');
  }, []);
  const setValue = useCallback((key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);
  const clearAll = useCallback(() => {
    setValues({});
    setSort(defaultSort);
  }, [defaultSort]);

  const sortDirty =
    !!sort &&
    !!defaultSort &&
    (sort.field !== defaultSort.field ||
      sort.direction !== defaultSort.direction);

  const value = useMemo(
    () => ({
      controls,
      values,
      setValue,
      clearAll,
      register,
      unregister,
      sortOptions,
      sort,
      sortDirty,
      sortKey,
      setSort,
    }),
    [
      controls,
      values,
      setValue,
      clearAll,
      register,
      unregister,
      sortOptions,
      sort,
      sortDirty,
      sortKey,
    ]
  );

  return (
    <MobileFilterContext.Provider value={value}>
      {children}
    </MobileFilterContext.Provider>
  );
};

const useMobileFilters = () => useContext(MobileFilterContext);

// Combine selected filters; arrays (e.g. `status`) concatenate rather than overwrite.
const concatArrays = (objValue: unknown, srcValue: unknown) =>
  Array.isArray(objValue) ? objValue.concat(srcValue) : undefined;

const buildFilter = (
  controls: readonly FilterControl[],
  values: FilterValues
): Record<string, any> | undefined => {
  const fragments = controls
    .map((c) => c.toFilter(values[c.key]))
    .filter((f): f is Record<string, any> => !!f);
  if (fragments.length === 0) {
    return undefined;
  }
  const initial: Record<string, any> = {};
  return fragments.reduce((acc, f) => mergeWith(acc, f, concatArrays), initial);
};

/**
 * Mobile filtering for a dense row list. Registers `controls` with the app shell
 * (so the header filter button can drive them) and returns the merged API `filter`
 * for `useListQuery`. Returns `undefined` when nothing is selected.
 */
export const useRowListFilters = (
  controls: readonly FilterControl[],
  sort?: SortConfig
) => {
  const ctx = useContext(MobileFilterContext);
  const register = ctx?.register;
  const unregister = ctx?.unregister;
  const values = ctx?.values;

  const keysSig = controls.map((c) => c.key).join('|');
  const optionsSig = sort?.options.map((o) => o.field).join('|') ?? '';
  // Identifies this list's sort registration; the context `sort` is only trusted
  // when it carries the same key (see effectiveSort below).
  const sortKey = sort
    ? `${optionsSig}#${sort.default.field}:${sort.default.direction}`
    : '';

  useEffect(() => {
    register?.(controls, sort ? { ...sort, key: sortKey } : undefined);
    return () => unregister?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keysSig/sortKey capture the meaningful change
  }, [keysSig, sortKey, register, unregister]);

  const filter = useMemo(
    () => buildFilter(controls, values ?? {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keysSig captures the meaningful change
    [keysSig, values]
  );

  // Use the shared sort only when it belongs to THIS list (matching sortKey).
  // On first render — before this list registers — the context still holds the
  // previous list's sort, so fall back to our own default and never query with a
  // stale/foreign sort.
  const effectiveSort =
    ctx?.sortKey === sortKey && ctx.sort ? ctx.sort : sort?.default;

  return {
    filter,
    sort: effectiveSort?.field,
    order: effectiveSort?.direction,
  };
};

/**
 * Global filter button for mobile: when the active list registers filters (via
 * {@link useRowListFilters}), this opens a drawer matching the grid's header filters.
 */
export const MobileFilterButton = () => {
  const ctx = useMobileFilters();
  const [open, setOpen] = useState(false);

  if (!ctx || ctx.controls.length === 0) {
    return null;
  }
  const {
    controls,
    values,
    setValue,
    clearAll,
    sortOptions,
    sort,
    sortDirty,
    setSort,
  } = ctx;
  const activeCount = controls.filter(
    (c) => !!c.toFilter(values[c.key])
  ).length;

  return (
    <>
      <IconButton
        aria-label={
          activeCount > 0 ? `Filters, ${activeCount} active` : 'Filters'
        }
        onClick={() => setOpen(true)}
      >
        <Badge color="info" badgeContent={activeCount}>
          <FilterList />
        </Badge>
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Stack sx={{ width: 'min(380px, 90vw)', height: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Typography variant="h3">Filters</Typography>
            <IconButton
              aria-label="Close filters"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stack sx={{ flex: 1, overflowY: 'auto', p: 2, gap: 2 }}>
            {sortOptions.length > 0 && sort && (
              <>
                <SortField
                  options={sortOptions}
                  value={sort}
                  onChange={setSort}
                />
                {controls.length > 0 && <Divider />}
              </>
            )}
            {controls.map((control) => (
              <FilterField
                key={control.key}
                control={control}
                value={values[control.key]}
                setValue={setValue}
              />
            ))}
          </Stack>

          <Stack
            direction="row"
            gap={1}
            sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
          >
            <Button
              fullWidth
              color="secondary"
              // Enabled when there are filters OR a non-default sort to reset.
              disabled={activeCount === 0 && !sortDirty}
              onClick={clearAll}
            >
              Clear all
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              disableElevation
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
};

const SortField = ({
  options,
  value,
  onChange,
}: {
  options: readonly SortOption[];
  value: SortState;
  onChange: (sort: SortState) => void;
}) => {
  const { field, direction } = value;
  return (
    <Stack gap={1}>
      <TextField
        select
        label="Sort by"
        size="small"
        fullWidth
        value={field}
        onChange={(e) => onChange({ field: e.target.value, direction })}
      >
        {options.map((option) => (
          <MenuItem key={option.field} value={option.field}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <ToggleButtonGroup
        exclusive
        fullWidth
        size="small"
        color="primary"
        value={direction}
        onChange={(_, next: SortDirection | null) =>
          next && onChange({ field, direction: next })
        }
      >
        <ToggleButton value="ASC">Ascending</ToggleButton>
        <ToggleButton value="DESC">Descending</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};

const FilterField = ({
  control,
  value,
  setValue,
}: {
  control: FilterControl;
  value: unknown;
  setValue: (key: string, value: unknown) => void;
}) => {
  const { kind, key, label, options = [] } = control;

  if (kind === 'search') {
    return (
      <FilterSearchField
        label={label}
        external={typeof value === 'string' ? value : ''}
        onChange={(text) => setValue(key, text)}
      />
    );
  }

  if (kind === 'boolean') {
    const current = value === true ? 'true' : value === false ? 'false' : '';
    return (
      <TextField
        select
        label={label}
        size="small"
        fullWidth
        value={current}
        onChange={(e) =>
          setValue(
            key,
            e.target.value === '' ? undefined : e.target.value === 'true'
          )
        }
      >
        <MenuItem value="">Any</MenuItem>
        <MenuItem value="true">Yes</MenuItem>
        <MenuItem value="false">No</MenuItem>
      </TextField>
    );
  }

  if (kind === 'select') {
    return (
      <TextField
        select
        label={label}
        size="small"
        fullWidth
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => setValue(key, e.target.value || undefined)}
      >
        <MenuItem value="">Any</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  const selected = Array.isArray(value) ? (value as string[]) : [];
  return (
    <TextField
      select
      label={label}
      size="small"
      fullWidth
      value={selected}
      onChange={(e) => setValue(key, e.target.value)}
      SelectProps={{
        multiple: true,
        renderValue: (sel) =>
          (sel as string[])
            .map((v) => options.find((o) => o.value === v)?.label ?? v)
            .join(', '),
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Checkbox checked={selected.includes(option.value)} />
          <ListItemText primary={option.label} />
        </MenuItem>
      ))}
    </TextField>
  );
};

const FilterSearchField = ({
  label,
  external,
  onChange,
}: {
  label: string;
  external: string;
  onChange: (value: string) => void;
}) => {
  const [text, setText] = useState(external);
  const debounced = useDebounce(text, { wait: 400 });

  // Push debounced input up to the shared filter state.
  useEffect(() => {
    onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire on debounced value change
  }, [debounced]);

  // Reflect external resets (e.g. "Clear all") back into the field.
  useEffect(() => {
    if (!external) {
      setText('');
    }
  }, [external]);

  return (
    <TextField
      label={label}
      value={text}
      onChange={(e) => setText(e.target.value)}
      size="small"
      fullWidth
    />
  );
};
