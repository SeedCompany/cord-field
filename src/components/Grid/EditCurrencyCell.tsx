import { InputBase } from '@mui/material';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material/utils';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import { useCallback, useRef } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';

export const EditCurrencyCell = (
  props: GridRenderEditCellParams<number | null | undefined>
) => {
  const { id, field, value, hasFocus } = props;

  const apiRef = useGridApiContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (values: NumberFormatValues) => {
      void apiRef.current.setEditCellValue({
        id,
        field,
        value: values.floatValue,
      });
    },
    [apiRef, id, field]
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
