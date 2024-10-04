import { useState } from 'react';
import { CalendarDate } from '~/common';
import { flexLayout } from '~/components/Grid';
import {
  ExpanderButton,
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
  // Set the current due date to 2 quarters ago for testing purposes
  const [currentDue] = useState(() => CalendarDate.now().minus({ quarter: 2 }));

  const Grid = expanded
    ? ProgressReportsExpandedGrid
    : ProgressReportsCollapsedGrid;
  return (
    <Widget {...props}>
      <WidgetHeader
        title={`Quarterly Reports - Q${currentDue.fiscalQuarter} FY${currentDue.fiscalYear}`}
        expandAction={
          <ExpanderButton
            expanded={expanded}
            to={expanded ? '/dashboard' : '/dashboard/progress-reports'}
          />
        }
      />
      <TableWidget>
        <Grid
          quarter={currentDue}
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
