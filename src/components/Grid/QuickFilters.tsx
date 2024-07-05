import {
  Stack,
  ToggleButton,
  ToggleButtonProps,
  Typography,
} from '@mui/material';
import { GridFilterItem, useGridRootProps } from '@mui/x-data-grid-pro';
import { many } from '@seedcompany/common';
import { useMemoizedFn } from 'ahooks';
import { useMemo } from 'react';
import { ChildrenProp, extendSx, StyleProps } from '~/common';

export const QuickFilters = (props: ChildrenProp & StyleProps) => (
  <Stack
    direction="row"
    alignItems="center"
    gap={1}
    sx={[
      {
        '.MuiToggleButton-root:not(.MuiToggleButtonGroup-grouped)': {
          margin: 0,
          py: 0.5,
        },
      },
      ...extendSx(props.sx),
    ]}
  >
    <Typography variant="body2">Quick Filters:</Typography>
    {props.children}
  </Stack>
);

export const QuickFilterButton = (props: ToggleButtonProps) => (
  <ToggleButton color="primary" size="small" {...props} />
);

export const QuickFilterResetButton = () => {
  const rootProps = useGridRootProps();

  const selected = useMemo(() => {
    const current = rootProps.filterModel?.items || [];
    return current.length === 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- name & selector shouldn't change
  }, [rootProps.filterModel]);

  const onChange = useMemoizedFn(() => {
    rootProps.onFilterModelChange!(
      {
        ...rootProps.filterModel,
        items: [],
      },
      {
        api: rootProps.apiRef!.current,
        reason: 'removeAllFilterItems',
      }
    );
  });
  return (
    <QuickFilterButton value="all" selected={selected} onChange={onChange}>
      All
    </QuickFilterButton>
  );
};

export const useFilterToggle = (
  columnFieldName: string,
  {
    isSelected,
    onToggle,
  }: {
    isSelected?: (current?: GridFilterItem | undefined) => boolean;
    onToggle?: (
      prev?: GridFilterItem | undefined
    ) => GridFilterItem | undefined;
  } = {}
) => {
  const rootProps = useGridRootProps();

  const selected = useMemo(() => {
    const current = rootProps.filterModel?.items || [];

    const currentItem = current.find((f) => f.field === columnFieldName);

    return isSelected ? isSelected(currentItem) : !!currentItem?.value;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- name & selector shouldn't change
  }, [rootProps.filterModel]);

  const onChange = useMemoizedFn(() => {
    const prev = rootProps.filterModel?.items || [];

    const currentValue = prev.find((f) => f.field === columnFieldName);

    const nextValue = onToggle
      ? onToggle(currentValue)
      : currentValue
      ? undefined
      : ({
          field: columnFieldName,
          value: true,
          operator: 'is',
        } satisfies GridFilterItem);
    const next = prev
      .filter((f) => f.field !== columnFieldName)
      .concat(...(nextValue ? [nextValue] : []));

    rootProps.onFilterModelChange!(
      {
        ...rootProps.filterModel,
        items: next,
      },
      {
        api: rootProps.apiRef!.current,
        reason: 'upsertFilterItem',
      }
    );
  });

  return {
    value: columnFieldName,
    selected,
    onChange,
  };
};

export const useEnumListFilterToggle = (
  columnFieldName: string,
  value: string
) =>
  useFilterToggle(columnFieldName, {
    isSelected: (current) => {
      if (!current) {
        return false;
      }
      const existing = new Set(many(current.value));
      return existing.has(value);
    },
    onToggle: (prev) => {
      const items = new Set(many(prev?.value ?? []));
      const next = !items.has(value);
      items[next ? 'add' : 'delete'](value);
      if (items.size === 0) {
        return undefined;
      }
      if (items.size === 1) {
        return {
          field: columnFieldName,
          operator: 'is',
          value: [...items][0]!,
        };
      }
      return {
        field: columnFieldName,
        operator: 'isAnyOf',
        value: [...items],
      };
    },
  });
