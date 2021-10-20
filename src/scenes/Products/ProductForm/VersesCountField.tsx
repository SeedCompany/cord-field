import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { NumberField, NumberFieldProps } from '../../../components/form';
import { max, min, required } from '../../../components/form/validators';
import { useNumberFormatter } from '../../../components/Formatters';
import { getBookTotalVerses } from '../../../util/biblejs';

interface VersesCountFieldProps
  extends Except<NumberFieldProps, 'helperText' | 'validate'> {
  book: string;
}

export const VersesCountField = ({ book, ...props }: VersesCountFieldProps) => {
  const formatNumber = useNumberFormatter();
  const [totalVerses, totalFormatted] = useMemo(() => {
    const total = getBookTotalVerses(book) ?? 0;
    return [total, formatNumber(total)] as const;
  }, [book, formatNumber]);
  return (
    <NumberField
      {...props}
      helperText={`${book} has ${totalFormatted} verses`}
      validate={[
        (value) =>
          value === totalVerses ? 'Choose full book option instead' : undefined,
        min(1),
        max(totalVerses - 1, `${book} only has ${totalFormatted} verses`),
        required,
      ]}
      autoComplete="off"
    />
  );
};
