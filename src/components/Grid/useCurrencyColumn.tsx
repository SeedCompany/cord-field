import { GridColDef } from '@mui/x-data-grid-pro';
import { useCurrencyFormatter } from '../Formatters/useCurrencyFormatter';
import { EditNumberCell } from './EditNumberCell';

export const useCurrencyColumn = () => {
  const formatCurrency = useCurrencyFormatter({
    maximumFractionDigits: 2,
  });
  const col: Partial<GridColDef> = {
    align: 'right',
    headerAlign: 'right',
    valueFormatter: (value: number | null) => formatCurrency(value ?? 0),
    renderEditCell: (props) => <EditNumberCell {...props} />,
  };
  return col;
};
