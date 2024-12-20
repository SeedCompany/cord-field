import { Error, Feedback, Warning } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem2 as TreeItem } from '@mui/x-tree-view/TreeItem2';
import { groupToMapBy } from '@seedcompany/common';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import { memo } from 'react';
import { PnpProblemSeverity as Severity } from '~/api/schema.graphql';
import { InlineCode } from '../Debug';
import { FormattedNumber } from '../Formatters';
import { Link } from '../Routing';
import { PnpProblemFragment as Problem } from './pnpExtractionResult.graphql';

export interface ProblemTreeProps {
  problems: readonly Problem[];
}
export const ProblemTree = memo(function ProblemTree({
  problems,
}: ProblemTreeProps) {
  return (
    <SimpleTreeView itemChildrenIndentation={6 * 8}>
      <ProblemList groupIndex={1} problems={problems} />
    </SimpleTreeView>
  );
});

export const ProblemList = memo(function ProblemList({
  problems,
  groupIndex,
}: ProblemTreeProps & {
  groupIndex: number;
}) {
  return [...groupToMapBy(problems, (p) => p.groups[groupIndex])].map(
    ([group, problems]) => {
      const { severity } = problems[0];
      if (group && (groupIndex === 1 || problems.length > 1)) {
        const currentNode =
          groupIndex === 1 ? (
            <Stack direction="row" gap={1} alignItems="center">
              <SeverityIcon severity={severity} />
              <div>
                (<FormattedNumber value={problems.length} />){' '}
                <Markdown options={mdOptions}>{group}</Markdown>
                <Doc problem={problems[0]} />
              </div>
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
                <div>
                  <Markdown options={mdOptions}>{problem.message}</Markdown>
                  {groupIndex === 1 && <Doc problem={problem} />}
                </div>
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

function Doc({ problem }: { problem: Problem }) {
  if (!problem.documentation) {
    return null;
  }
  return (
    <Typography color="text.secondary" sx={{ mt: 1 }}>
      For more information see the PnP Troubleshooting{' '}
      <Link external to={problem.documentation} target="_blank">
        Guide
      </Link>
    </Typography>
  );
}

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
