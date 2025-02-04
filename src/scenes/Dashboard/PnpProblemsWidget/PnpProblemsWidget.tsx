import { useLocation } from 'react-router-dom';
import { flexLayout } from '~/components/Grid';
import {
  ExpanderButton,
  TableWidget,
  Widget,
  WidgetHeader,
  WidgetProps,
} from '~/components/Widgets';
import { QuarterSelect } from '../ProgressReportsWidget/QuarterSelect';
import { useQuarterState } from '../ProgressReportsWidget/useQuarterState';
import { PnpProblemsGrid } from './PnpProblemsGrid';

export const PnpProblemsWidget = ({
  expanded,
  ...props
}: WidgetProps & { expanded: boolean }) => {
  const quarter = useQuarterState();
  const location = useLocation();

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
        <QuarterSelect {...quarter} />
      </WidgetHeader>
      <TableWidget>
        <PnpProblemsGrid
          quarter={quarter.current}
          hideFooter
          expanded={expanded}
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
