import { useState } from 'react';
import { CalendarDate } from '~/common';
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
  const [currentDue] = useState(() => CalendarDate.now().minus({ quarter: 1 }));

  const Grid = expanded
    ? ProgressReportsExpandedGrid
    : ProgressReportsCollapsedGrid;
  return (
    <Widget {...props}>
      <WidgetHeader
        title={`Quarterly Reports - Q${currentDue.fiscalQuarter} FY${currentDue.fiscalYear}`}
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
