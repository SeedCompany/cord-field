import { Autocomplete, TextField } from '@mui/material';
import { DateTime } from 'luxon';
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
  const [availableQuarters] = useState(() => {
    const start = DateTime.local(2023, 7) as DateTime<true>;
    const end = DateTime.now().minus({ quarter: 1 });
    return start
      .until(end)
      .splitBy({ quarters: 1 })
      .map((i) => CalendarDate.fromDateTime(i.start!) as CalendarDate<true>)
      .reverse();
  });
  const [currentQuarter, setCurrentQuarter] = useState(
    () => availableQuarters[0]!
  );

  const Grid = expanded
    ? ProgressReportsExpandedGrid
    : ProgressReportsCollapsedGrid;
  return (
    <Widget {...props}>
      <WidgetHeader
        title="Quarterly Reports"
        expandAction={
          <ExpanderButton
            expanded={expanded}
            to={expanded ? '/dashboard' : '/dashboard/progress-reports'}
          />
        }
      >
        <Autocomplete
          disablePortal
          options={availableQuarters}
          getOptionLabel={(q) => `Q${q.fiscalQuarter} FY${q.fiscalYear}`}
          value={currentQuarter}
          onChange={(_, q) => setCurrentQuarter(q)}
          disableClearable
          size="small"
          renderInput={(params) => (
            <TextField variant="outlined" margin="none" {...params} />
          )}
          sx={{ width: 137 }}
        />
      </WidgetHeader>
      <TableWidget>
        <Grid
          quarter={currentQuarter}
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
