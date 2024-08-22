import { FilterList as FilterListIcon } from '@mui/icons-material';
import { Button, Stack, Tooltip } from '@mui/material';
import {
  gridFilterModelSelector,
  GridHeaderFilterCellProps,
  GridHeaderFilterEventLookup,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import {
  EventHandler,
  SyntheticEvent,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';

/**
 * Copied from MUI
 * @see https://mui.com/x/react-data-grid/filtering/header-filters/#headerfiltercell-slot
 */
export function GridHeaderAddFilterButton(props: GridHeaderFilterCellProps) {
  const { colDef, width, height, hasFocus, colIndex } = props;
  const apiRef = useGridApiContext();
  const cellRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (hasFocus && cellRef.current) {
      const focusableElement =
        cellRef.current.querySelector<HTMLElement>('[tabindex="0"]');
      const elementToFocus = focusableElement || cellRef.current;
      elementToFocus.focus();
    }
  }, [apiRef, hasFocus]);

  const publish = useCallback(
    (
        eventName: keyof GridHeaderFilterEventLookup,
        propHandler?: EventHandler<any>
      ) =>
      (event: SyntheticEvent) => {
        apiRef.current.publishEvent(
          eventName,
          apiRef.current.getColumnHeaderParams(colDef.field),
          event as any
        );

        if (propHandler) {
          propHandler(event);
        }
      },
    [apiRef, colDef.field]
  );

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!hasFocus) {
        cellRef.current?.focus();
        apiRef.current.setColumnHeaderFilterFocus(colDef.field, event);
      }
    },
    [apiRef, colDef.field, hasFocus]
  );

  const mouseEventsHandlers = useMemo(
    () => ({
      onKeyDown: publish('headerFilterKeyDown'),
      onClick: publish('headerFilterClick'),
      onMouseDown: publish('headerFilterMouseDown', onMouseDown),
    }),
    [publish, onMouseDown]
  );

  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const activeFiltersCount = filterModel.items.filter(
    ({ field }) => field === colDef.field
  ).length;

  return (
    <Stack
      tabIndex={-1}
      ref={cellRef}
      data-field={colDef.field}
      width={width}
      height={height}
      justifyContent="center"
      alignItems="center"
      role="columnheader"
      aria-colindex={colIndex + 1}
      aria-label={colDef.headerName ?? colDef.field}
      {...mouseEventsHandlers}
    >
      <Tooltip
        title={
          activeFiltersCount
            ? `${activeFiltersCount} Filter Applied`
            : 'Apply Filter'
        }
      >
        <Button
          onClick={() => apiRef.current.showFilterPanel(colDef.field)}
          // Deviate from MUI example here for our own overall consistency
          tabIndex={-1}
          variant="outlined"
          color="inherit"
          fullWidth
          sx={(theme) => ({
            // Match OutlinedSelect filter
            height: 40,
            backgroundColor: 'transparent',
            '&:not(:hover)': {
              borderColor:
                theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.23)'
                  : 'rgba(255, 255, 255, 0.23)',
            },
          })}
        >
          <FilterListIcon />
        </Button>
      </Tooltip>
    </Stack>
  );
}
