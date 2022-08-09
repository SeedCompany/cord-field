import { GridColDef } from '@mui/x-data-grid';
import { useCurrencyFormatter } from '../Formatters/useCurrencyFormatter';
import { EditCurrencyCell } from './EditCurrencyCell';

export const useCurrencyColumn = () => {
  const formatCurrency = useCurrencyFormatter({
    maximumFractionDigits: 2,
  });
  const col: Partial<GridColDef> = {
    align: 'right',
    headerAlign: 'right',
    valueFormatter: ({ value }) => formatCurrency(value ?? 0),
    renderEditCell: (props) => <EditCurrencyCell {...props} />,
  };
  return col;
};
