import {
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  useRadioGroup,
} from '@material-ui/core';
import { ReactNode } from 'react';
import * as React from 'react';
import { Order } from '../../api';

const useStyles = makeStyles(({ typography, spacing }) => ({
  label: {
    fontWeight: typography.weight.bold,
    margin: spacing(2, 0, 1),
  },
}));

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
  const classes = useStyles();
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
      <FormLabel className={classes.label}>{label}</FormLabel>
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
        onChange?.(
          {
            target: {
              value: {
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
