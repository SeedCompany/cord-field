import { DataGridProProps as DataGridProps } from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { DefaultDataGridStyles } from './DefaultDataGridStyles';

export const useDataGridSlots = (
  dataGridProps: Pick<DataGridProps, 'slots' | 'slotProps'>,
  overrides?: Pick<DataGridProps, 'slots' | 'slotProps'>
) => {
  const slots = useMemo(
    () =>
      merge(
        {},
        DefaultDataGridStyles.slots,
        dataGridProps.slots,
        overrides?.slots
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataGridProps.slots, overrides?.slots]
  );

  const slotProps = useMemo(
    () =>
      merge(
        {},
        DefaultDataGridStyles.slotProps,
        dataGridProps.slotProps,
        overrides?.slotProps
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataGridProps.slotProps, overrides?.slotProps]
  );

  return { slots, slotProps };
};
