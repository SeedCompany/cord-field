import { Autocomplete, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
  ExpanderButton,
  TableWidget,
  Widget,
  WidgetHeader,
  WidgetProps,
} from '~/components/Widgets';
import { useQuarterState } from '../ProgressReportsWidget/useQuarterState';

export const PnpErrorsWidget = ({
  expanded,
  ...props
}: WidgetProps & { expanded: boolean }) => {
  const quarter = useQuarterState();
  const location = useLocation();

  //   const Grid = expanded ? PnpProblemsGrid;
  return (
    <Widget {...props}>
      <WidgetHeader
        title="PnP Problems"
        expandAction={
          <ExpanderButton
            expanded={expanded}
            to={{
              pathname: expanded ? '..' : 'pnp-errors',
              search: location.search,
            }}
          />
        }
      >
        <Autocomplete
          disablePortal
          options={quarter.available}
          getOptionLabel={(q) => `Q${q.fiscalQuarter} FY${q.fiscalYear}`}
          isOptionEqualToValue={(a, b) => +a === +b}
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
        {/* <Grid
          quarter={quarter.current}
          hideFooter
          sx={[
            {
              border: 'none',
              '--unstable_DataGrid-radius': 0,
            },
            flexLayout,
          ]}
        /> */}
      </TableWidget>
    </Widget>
  );
};
