import {
  Check as CheckIcon,
  Close as CloseIcon,
  QuestionMark,
} from '@mui/icons-material';
import { GridEditSingleSelectCell } from '@mui/x-data-grid-pro';
import { mapEntries } from '@seedcompany/common';
import { column, RowLike } from './definition.types';
import { enumColumn } from './enumColumn';

const labelToValue = {
  Unknown: null,
  Yes: true,
  No: false,
} as const;

const icons = {
  Yes: <CheckIcon color="success" sx={{ margin: 'auto' }} />,
  No: <CloseIcon color="error" sx={{ margin: 'auto' }} />,
  Unknown: <QuestionMark color="action" sx={{ margin: 'auto' }} />,
};

type Formatted = keyof typeof labelToValue;
const options = Object.keys(labelToValue) as Formatted[];
const labels = mapEntries(labelToValue, ([k]) => [k, k]).asRecord;
const valueToLabel = mapEntries(labelToValue, ([k, v]) => [v, k]).asMap;

export const booleanNullableColumn = <Row extends RowLike>() =>
  column<Row>()({
    ...enumColumn<Row, Formatted>(options, labels),
    type: 'singleSelect',
    // filterOperators: [], // TODO
    valueFormatter: (value: boolean | null) => valueToLabel.get(value),
    getOptionLabel: (value: Formatted) => icons[value],
    display: 'flex',
    renderCell: ({ formattedValue }) => {
      const v = formattedValue as Formatted;
      return v !== 'Unknown' ? icons[v] : null;
    },
    renderEditCell: (params) => {
      if (typeof params.value === 'string') {
        // Value selected, and therefore about to close, but given formatted value.
        // Don't bother trying to remap value just close.
        return null;
      }
      return (
        <GridEditSingleSelectCell
          {...params}
          value={valueToLabel.get(params.value)}
          // Stop editing on the first value changed.
          // This way users' change will be sent to the server immediately after
          // selecting a new value without needing another interaction.
          onValueChange={async (event, formatted: Formatted) => {
            const { api, id, field } = params;
            const value = labelToValue[formatted];
            await api.setEditCellValue({ id, field, value }, event);
            api.stopCellEditMode({ id, field });
          }}
          sx={{
            '.MuiSelect-select': {
              // center icon
              display: 'flex',
              justifyContent: 'center',
              // adjust to render outline within the cell
              // and ignore arrow padding to center horizontally
              px: '4px !important',
            },
            '[data-testid="ArrowDropDownIcon"]': { display: 'none' },
          }}
        />
      );
    },
  });
