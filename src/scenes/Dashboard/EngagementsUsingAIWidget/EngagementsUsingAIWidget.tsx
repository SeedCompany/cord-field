import { useLocation } from 'react-router-dom';
import { flexLayout } from '~/components/Grid';
import {
  ExpanderButton,
  TableWidget,
  Widget,
  WidgetHeader,
  WidgetProps,
} from '~/components/Widgets';
import { useQuarterState } from '../ProgressReportsWidget/useQuarterState';
import { EngagementsUsingAIGrid } from './EngagementsUsingAIGrid';

export const EngagementsUsingAIWidget = ({
  expanded,
  ...props
}: WidgetProps & { expanded: boolean }) => {
  const quarter = useQuarterState();
  const location = useLocation();

  return (
    <Widget {...props}>
      <WidgetHeader
        title="Engagements Using AI"
        expandAction={
          <ExpanderButton
            expanded={expanded}
            to={{
              pathname: expanded ? '..' : 'engagements-using-ai',
              search: location.search,
            }}
          />
        }
      />
      <TableWidget>
        <EngagementsUsingAIGrid
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
