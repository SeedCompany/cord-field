import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { groupToMapBy } from '@seedcompany/common';
import { memo, ReactNode, useState } from 'react';
import { ProblemTreeProps } from './PnPExtractionProblems';

export const ProblemsWithSheetsAsTabs = memo(function ProblemsWithSheetsAsTabs({
  problems,
  children,
}: ProblemTreeProps & {
  children: (props: ProblemTreeProps & { sheet: string }) => ReactNode;
}) {
  const bySheet = groupToMapBy(problems, (p) => p.groups[0]!);
  const [tab, setTab] = useState(bySheet.keys().next().value);

  return (
    <TabContext value={tab}>
      <Box sx={{ pl: 1, borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={(_, next) => setTab(next)}>
          {[...bySheet.keys()].toSorted().map((sheet) => (
            <Tab key={sheet} value={sheet} label={sheet} />
          ))}
        </TabList>
      </Box>
      {[...bySheet].map(([sheet, problems]) => (
        <TabPanel key={sheet} value={sheet} sx={{ p: 1 }}>
          {children({ sheet, problems })}
        </TabPanel>
      ))}
    </TabContext>
  );
});
