import { Box, SelectChangeEvent } from '@mui/material';
import { GridFilterInputBooleanProps } from '@mui/x-data-grid';
import { useGridRootProps } from '@mui/x-data-grid-pro';
import { useCallback, useId } from 'react';

export const GridFilterInputBoolean = (props: GridFilterInputBooleanProps) => {
  const {
    item,
    applyValue,
    apiRef,
    focusElementRef,
    isFilterActive,
    clearButton,
    tabIndex,
    label: labelProp,
    variant = 'standard',
    InputLabelProps,
    ...others
  } = props;

  const value = item.value ?? null;

  const rootProps = useGridRootProps();
  const labelId = useId();
  const selectId = useId();
  const baseSelectProps = rootProps.slotProps?.baseSelect || {};
  const baseSelectOptionProps = rootProps.slotProps?.baseSelectOption || {};

  const isHeaderFilter = isFilterActive !== undefined;

  const onFilterChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const next = { ...item, value: event.target.value };
      // Not using applyValues here because it has a falsy check.
      // Replacing here with nil check, so we can use false as a filter value.
      // Also, only delete item if this is a header filter change,
      // if in the filter dialog we want to keep the filter row.
      const action =
        item.value != null && next.value == null && isHeaderFilter
          ? ('delete' as const)
          : ('upsert' as const);
      apiRef.current[`${action}FilterItem`](next);
    },
    [apiRef, item, isHeaderFilter]
  );

  const label =
    labelProp ?? apiRef.current.getLocaleText('filterPanelInputLabel');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        '& button': {
          margin: 'auto 0px 5px 5px',
        },
      }}
    >
      <rootProps.slots.baseFormControl fullWidth>
        <rootProps.slots.baseInputLabel
          {...rootProps.slotProps?.baseInputLabel}
          id={labelId}
          shrink
          variant={variant}
        >
          {label}
        </rootProps.slots.baseInputLabel>
        <rootProps.slots.baseSelect
          labelId={labelId}
          id={selectId}
          label={label}
          value={value}
          onChange={onFilterChange}
          variant={variant}
          notched={variant === 'outlined' ? true : undefined}
          native={false}
          displayEmpty
          renderValue={renderValue}
          inputProps={{
            ref: focusElementRef,
          }}
          {...(others as any)}
          {...baseSelectProps}
        >
          <rootProps.slots.baseSelectOption
            {...baseSelectOptionProps}
            native={false}
            value={null}
          >
            <i>Any</i>
          </rootProps.slots.baseSelectOption>
          <rootProps.slots.baseSelectOption
            {...baseSelectOptionProps}
            native={false}
            value={true}
          >
            Yes
          </rootProps.slots.baseSelectOption>
          <rootProps.slots.baseSelectOption
            {...baseSelectOptionProps}
            native={false}
            value={false}
          >
            No
          </rootProps.slots.baseSelectOption>
        </rootProps.slots.baseSelect>
      </rootProps.slots.baseFormControl>
      {clearButton}
    </Box>
  );
};

const renderValue = (value: boolean | null) =>
  value == null ? <Box color="text.disabled">Any</Box> : value ? 'Yes' : 'No';
