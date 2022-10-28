import { FormControlLabel, FormLabel, Radio } from '@mui/material';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { useRadioGroup } from '@mui/material/RadioGroup';
import { ReactNode } from 'react';
import { Order } from '~/api/schema.graphql';

export interface SortOptionProps<T> {
  label: ReactNode;
  value: keyof T;
  asc?: ReactNode;
  desc?: ReactNode;
  defaultOrder?: Order;
  default?: boolean;
}

export function SortOption<T>({
  label,
  value: sort,
  asc,
  desc,
  defaultOrder = 'ASC',
  default: defaultVal = false,
}: SortOptionProps<T>) {
  const ascNode = asc ? (
    <ActualSortOption
      order="ASC"
      label={asc}
      sort={sort}
      defaultOrder={defaultOrder}
      default={defaultVal && defaultOrder === 'ASC'}
    />
  ) : null;
  const descNode = desc ? (
    <ActualSortOption
      order="DESC"
      label={desc}
      sort={sort}
      defaultOrder={defaultOrder}
      default={defaultVal && defaultOrder === 'DESC'}
    />
  ) : null;
  return (
    <>
      <FormLabel sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>{label}</FormLabel>
      {defaultOrder === 'ASC' ? (
        <>
          {ascNode}
          {descNode}
        </>
      ) : (
        <>
          {descNode}
          {ascNode}
        </>
      )}
    </>
  );
}

function ActualSortOption<T>({
  order,
  label,
  sort,
  defaultOrder,
  default: defaultVal,
}: {
  order: Order;
  label: React.ReactNode;
  sort: keyof T;
  defaultOrder: Order;
  default: boolean;
}) {
  const { value, onChange } = useRadioGroup()!;
  return (
    <FormControlLabel
      label={label}
      onChange={() => {
        // Ignore types and fake event to send to RadioGroup which will convert
        // it back to SortValue. This is so we don't have to use our own context
        // to pass onChange callback from SortControl down to SortOptions.
        onChange(
          {
            target: {
              value: defaultVal
                ? {}
                : {
                    sort,
                    order,
                  },
            },
          } as any,
          ''
        );
      }}
      checked={
        (value.sort ? value.sort === sort : defaultVal) &&
        (value.order ? value.order === order : defaultOrder === order)
      }
      control={<Radio />}
    />
  );
}
