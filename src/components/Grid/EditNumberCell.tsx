import { InputBase } from '@mui/material';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import { useCallback, useRef } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';

type EditNumberCellProps = GridRenderEditCellParams<
  any,
  string | number | null | undefined
> & {
  max?: number;
};

export const EditNumberCell = (props: EditNumberCellProps) => {
  const { id, field, value, hasFocus, max } = props;

  const apiRef = useGridApiContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (values: NumberFormatValues) => {
      const value =
        max && values.floatValue
          ? Math.min(values.floatValue, max)
          : values.floatValue ?? null;
      void apiRef.current.setEditCellValue({ id, field, value });
    },
    [max, apiRef, id, field]
  );

  useEnhancedEffect(() => {
    hasFocus && inputRef.current?.focus();
  }, [hasFocus]);

  return (
    <NumberFormat
      customInput={InputBase}
      value={value}
      onValueChange={handleChange}
      thousandSeparator
      allowEmptyFormatting
      // InputBase props below:
      inputRef={inputRef}
      fullWidth
      // All to make the transition seamless between view and edit
      sx={{
        fontSize: 14,
        px: 1,
        '& > input': {
          textAlign: 'right',
          pr: '1px',
        },
      }}
    />
  );
};
