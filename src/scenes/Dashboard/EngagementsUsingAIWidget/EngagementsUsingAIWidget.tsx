import { useLocation } from 'react-router-dom';
import { flexLayout } from '~/components/Grid';
import {
  ExpanderButton,
  TableWidget,
  Widget,
  WidgetHeader,
  WidgetProps,
} from '~/components/Widgets';
import { EngagementsUsingAIGrid } from './EngagementsUsingAIGrid';

export const EngagementsUsingAIWidget = ({
  expanded,
  ...props
}: WidgetProps & { expanded: boolean }) => {
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
