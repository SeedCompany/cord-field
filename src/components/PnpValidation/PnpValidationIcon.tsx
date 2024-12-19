import { Check, Error, Warning } from '@mui/icons-material';
import { Badge, IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { groupToMapBy } from '@seedcompany/common';
import { PnpProblemSeverity as Severity } from '~/api/schema.graphql';
import { useDialog } from '../Dialog';
import { FileNodeInfoFragment } from '../files';
import { useNumberFormatter } from '../Formatters';
import { PnPExtractionProblems } from './PnPExtractionProblems';
import { PnpExtractionResultFragment } from './pnpExtractionResult.graphql';
import { PnPExtractionResultDialog } from './PnpExtractionResultDialog';

export const PnPValidationIcon = ({
  size,
  result,
  engagement,
}: {
  file: FileNodeInfoFragment;
  result: PnpExtractionResultFragment;
  engagement: { id: string };
} & Pick<IconButtonProps, 'size'>) => {
  const [dialog, open] = useDialog();

  const formatNumber = useNumberFormatter();
  const bySev = groupToMapBy(result.problems, (p) => p.severity);
  const count = (sev: Severity) => formatNumber(bySev.get(sev)!.length);

  const { Icon, color, badge, title } = bySev.has('Error')
    ? {
        Icon: Error,
        color: 'error' as const,
        badge: count('Error'),
        title: `${count('Error')} error(s)`,
      }
    : bySev.has('Warning')
    ? {
        Icon: Warning,
        color: 'warning' as const,
        badge: count('Warning'),
        title: `${count('Warning')} warning(s)`,
      }
    : {
        Icon: Check,
        color: 'success' as const,
        badge: undefined,
        title: 'Validation Passed!',
      };

  return (
    <>
      <Tooltip title={title}>
        <Badge badgeContent={badge} max={Infinity}>
          <IconButton color={color} size={size} onClick={open}>
            <Icon />
          </IconButton>
        </Badge>
      </Tooltip>
      <PnPExtractionResultDialog fullWidth {...dialog}>
        <PnPExtractionProblems result={result} engagement={engagement} />
      </PnPExtractionResultDialog>
    </>
  );
};
