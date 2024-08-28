import { Error, Feedback, Warning } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Alert, Box, Stack, Tab } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem2 as TreeItem } from '@mui/x-tree-view/TreeItem2';
import { cmpBy, groupToMapBy } from '@seedcompany/common';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import { memo, useState } from 'react';
import { PnpProblemSeverity as Severity } from '~/api/schema.graphql';
import { InlineCode } from '../../../components/Debug';
import { FormattedNumber } from '../../../components/Formatters';
import { Link } from '../../../components/Routing';
import {
  PnpProblemFragment as Problem,
  PnpExtractionResultFragment as Result,
} from './pnpExtractionResult.graphql';

const priority = ['Error', 'Warning', 'Notice'] satisfies Severity[];

export const PnPExtractionProblems = memo(function PnPExtractionProblems({
  result,
  engagement,
}: {
  result: Result;
  engagement: { id: string };
}) {
  const bySheet = groupToMapBy(
    result.problems.toSorted(
      cmpBy((problem) => priority.indexOf(problem.severity))
    ),
    (p) => p.groups[0]!
  );
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
          {sheet === 'Planning' && (
            <Alert severity="info" sx={{ mb: 1 }}>
              Once these problems are fixed, the updated file needs to be
              uploaded on the{' '}
              <Link
                to={`/engagements/${engagement.id}`}
                color="inherit"
                underline="always"
              >
                Planning Spreadsheet
              </Link>{' '}
              to synchronize the changes for the planned goals.
              <br />
              And then uploaded on the <em>PnP File</em> for{' '}
              <strong>this</strong> report, to synchronize the progress of these
              planned goals.
            </Alert>
          )}
          <SimpleTreeView>
            <ProblemList groupIndex={1} problems={problems} />
          </SimpleTreeView>
        </TabPanel>
      ))}
    </TabContext>
  );
});

export const ProblemList = memo(function ProblemList({
  problems,
  groupIndex,
}: {
  problems: readonly Problem[];
  groupIndex: number;
}) {
  return [...groupToMapBy(problems, (p) => p.groups[groupIndex])].map(
    ([group, problems]) => {
      const { severity } = problems[0]!;
      if (group && (groupIndex === 1 || problems.length > 1)) {
        const currentNode =
          groupIndex === 1 ? (
            <Stack direction="row" gap={1} alignItems="center">
              <SeverityIcon severity={severity} />
              <Markdown options={mdOptions}>{group}</Markdown>
              (<FormattedNumber value={problems.length} />)
            </Stack>
          ) : (
            <Markdown options={mdOptions}>{group}</Markdown>
          );

        return (
          <TreeItem key={group} itemId={group} label={currentNode}>
            <ProblemList problems={problems} groupIndex={groupIndex + 1} />
          </TreeItem>
        );
      } else {
        return problems.map((problem) => (
          <TreeItem
            key={problem.id}
            itemId={problem.id}
            label={
              <Stack direction="row" gap={1} alignItems="center">
                {groupIndex === 1 && <SeverityIcon severity={severity} />}
                <Markdown options={mdOptions}>{problem.message}</Markdown>
              </Stack>
            }
          />
        ));
      }
    }
  );
});

const mdOptions: MarkdownToJSX.Options = {
  forceInline: true,
  overrides: {
    code: InlineCode,
  },
};

const SeverityIcon = ({ severity }: { severity: Severity }) => {
  if (severity === 'Error') {
    return <Error color="error" />;
  }
  if (severity === 'Warning') {
    return <Warning color="warning" />;
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (severity === 'Notice') {
    return <Feedback color="info" />;
  }

  return null;
};
