import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { GridFilterInputBoolean } from '../GridFilterInputBoolean';
import { column, RowLike } from './definition.types';

export const booleanColumn = <Row extends RowLike>() =>
  column<Row>()({
    type: 'boolean',
    filterOperators: [
      {
        value: 'is',
        getApplyFilterFn: (filterItem) => {
          // Replacing falsy check with nil check, so we can use false as a filter value.
          if (filterItem.value == null) {
            return null;
          }
          // I don't think the type coercion is needed here, but keeping to be safe.
          const valueAsBoolean = String(filterItem.value) === 'true';
          return (value) => {
            return Boolean(value) === valueAsBoolean;
          };
        },
        InputComponent: GridFilterInputBoolean,
      },
    ],
    renderCell: ({ value }) =>
      value ? (
        <CheckIcon color="success" />
      ) : value === false ? (
        <CloseIcon color="error" />
      ) : null,
  });
