import { FilterList as FilterListIcon } from '@mui/icons-material';
import { Button, Stack, Tooltip } from '@mui/material';
import {
  gridFilterModelSelector,
  GridHeaderFilterCellProps,
  GridHeaderFilterEventLookup,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

export function GridHeaderAddFilterButton(props: GridHeaderFilterCellProps) {
  const { colDef, width, height, hasFocus, colIndex, tabIndex } = props;
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
        propHandler?: React.EventHandler<any>
      ) =>
      (event: React.SyntheticEvent) => {
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
      tabIndex={tabIndex}
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
          centerRipple={false}
          onClick={() => apiRef.current.showFilterPanel(colDef.field)}
          variant="outlined"
          sx={(theme) => ({
            color: theme.palette.grey[400],
            borderColor: theme.palette.grey[400],
            height: 40,
            '&:hover': {
              borderColor: theme.palette.grey[800],
              color: theme.palette.grey[800],
              backgroundColor: 'inherit',
            },
          })}
        >
          <FilterListIcon />
        </Button>
      </Tooltip>
    </Stack>
  );
}
