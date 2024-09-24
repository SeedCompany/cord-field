import {
  TableWidget,
  Widget,
  WidgetBody,
  WidgetHeader,
} from '~/components/Widgets';
import { ProgressReportsGrid } from './ProgressReportsGrid';

export const ProgressReportsWidget = () => {
  return (
    <Widget colSpan={8} rowSpan={6}>
      <WidgetHeader
        title="Quarterly Reports"
        to="/dashboard/progress-reports"
      />
      <WidgetBody>
        <TableWidget>
          <ProgressReportsGrid
            sx={{
              '--unstable_DataGrid-radius': '0px',
              border: 'none',
              height: '100cqh',
            }}
            hideFooter
          />
        </TableWidget>
      </WidgetBody>
    </Widget>
  );
};
