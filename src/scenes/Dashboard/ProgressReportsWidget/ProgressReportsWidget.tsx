import { flexLayout } from '~/components/Grid';
import {
  TableWidget,
  Widget,
  WidgetHeader,
  WidgetProps,
} from '~/components/Widgets';
import { ProgressReportsCollapsedGrid } from './ProgressReportsCollapsedGrid';
import { ProgressReportsExpandedGrid } from './ProgressReportsExpandedGrid';

export const ProgressReportsWidget = ({
  expanded,
  ...props
}: WidgetProps & { expanded: boolean }) => {
  const Grid = expanded
    ? ProgressReportsExpandedGrid
    : ProgressReportsCollapsedGrid;
  return (
    <Widget {...props}>
      <WidgetHeader
        title="Quarterly Reports"
        to={expanded ? '/dashboard' : '/dashboard/progress-reports'}
        expanded={expanded}
      />
      <TableWidget>
        <Grid
          hideFooter
          sx={[
            {
              border: 'none',
              '--unstable_DataGrid-radius': 0,
            },
            flexLayout,
          ]}
        />
      </TableWidget>
    </Widget>
  );
};
