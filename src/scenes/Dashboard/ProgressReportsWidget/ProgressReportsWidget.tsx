import { Autocomplete, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
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
import { useQuarterState } from './useQuarterState';

export const ProgressReportsWidget = ({
  expanded,
  ...props
}: WidgetProps & { expanded: boolean }) => {
  const quarter = useQuarterState();
  const location = useLocation();

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
            to={{
              pathname: expanded ? '..' : 'progress-reports',
              search: location.search,
            }}
          />
        }
      >
        <Autocomplete
          disablePortal
          options={quarter.available}
          getOptionLabel={(q) => `Q${q.fiscalQuarter} FY${q.fiscalYear}`}
          value={quarter.current}
          onChange={(_, q) => quarter.set(q)}
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
          quarter={quarter.current}
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
