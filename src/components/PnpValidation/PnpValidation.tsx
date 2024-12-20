import { DialogContent, IconButtonProps } from '@mui/material';
import { cmpBy } from '@seedcompany/common';
import { ComponentType, useMemo } from 'react';
import { PnpProblemSeverity as Severity } from '~/api/schema.graphql';
import { ChildrenProp } from '../../common';
import { useDialog } from '../Dialog';
import { ProblemTree, ProblemTreeProps } from './PnPExtractionProblems';
import {
  PnpExtractionResultFragment,
  PnpExtractionResultFragment as Result,
} from './pnpExtractionResult.graphql';
import { PnPExtractionResultDialog } from './PnpExtractionResultDialog';
import { PnPValidationIcon } from './PnpValidationIcon';

export const PnPValidation = ({
  result,
  slots,
}: {
  result: PnpExtractionResultFragment;
  slots?: {
    dialogContent?: ComponentType<ChildrenProp>;
    problems?: ComponentType<ProblemTreeProps>;
  };
} & Pick<IconButtonProps, 'size'>) => {
  const [dialog, open] = useDialog();

  const problems = useMemo(() => problemsToShow(result), [result]);

  const Content = slots?.dialogContent ?? DialogContent;
  const ProblemList = slots?.problems ?? ProblemTree;

  return (
    <>
      <PnPValidationIcon problems={problems} size="small" onClick={open} />
      <PnPExtractionResultDialog fullWidth {...dialog}>
        <Content>
          <ProblemList problems={problems} />
        </Content>
      </PnPExtractionResultDialog>
    </>
  );
};

const problemsToShow = (result: Result) => {
  // Temporarily filter out problems with "Notice" severity
  const filteredProblems = result.problems.filter(
    (problem) => problem.severity !== 'Notice'
  );

  return filteredProblems.toSorted(
    cmpBy((problem) => priority.indexOf(problem.severity))
  );
};

const priority = ['Error', 'Warning', 'Notice'] satisfies Severity[];
