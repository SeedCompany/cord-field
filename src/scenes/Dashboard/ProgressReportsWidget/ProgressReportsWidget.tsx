import { Autocomplete, TextField } from '@mui/material';
import { Nil } from '@seedcompany/common';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CalendarDate } from '~/common';
import { flexLayout } from '~/components/Grid';
import {
  ExpanderButton,
  TableWidget,
  Widget,
  WidgetHeader,
  WidgetProps,
} from '~/components/Widgets';
import { makeQueryHandler } from '~/hooks';
import { ProgressReportsCollapsedGrid } from './ProgressReportsCollapsedGrid';
import { ProgressReportsExpandedGrid } from './ProgressReportsExpandedGrid';

const useQueryParams = makeQueryHandler({
  quarter: {
    encode: (q: CalendarDate | Nil) =>
      q ? q.plus({ quarter: 1 }).toFormat('yy-q') : undefined,
    decode: (input) => {
      const q = Array.isArray(input) ? input[0] : input;
      return q
        ? CalendarDate.fromFormat(q, 'yy-q').minus({ quarter: 1 })
        : undefined;
    },
  },
});

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
  const [params, setParams] = useQueryParams();
  const location = useLocation();

  // Remove query param if invalid / out of range
  useEffect(() => {
    const { quarter } = params;
    if (!quarter) {
      return;
    }
    if (!quarter.isValid || !availableQuarters.some((q) => q.equals(quarter))) {
      setParams({ quarter: undefined });
    }
  }, [params, setParams, availableQuarters]);

  const currentQuarter =
    (params.quarter?.isValid ? params.quarter : null) ?? availableQuarters[0]!;

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
          options={availableQuarters}
          getOptionLabel={(q) => `Q${q.fiscalQuarter} FY${q.fiscalYear}`}
          value={currentQuarter}
          onChange={(_, q) =>
            setParams({
              quarter: q === availableQuarters[0]! ? undefined : q,
            })
          }
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
