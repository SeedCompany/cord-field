import { Check, Error, Warning } from '@mui/icons-material';
import { Badge, IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { groupToMapBy } from '@seedcompany/common';
import { PnpProblemSeverity as Severity } from '~/api/schema.graphql';
import { FileNodeInfoFragment } from '../../../components/files';
import { useNumberFormatter } from '../../../components/Formatters';
import { PnpExtractionResultFragment } from './pnpExtractionResult.graphql';

export const PnPValidationIcon = ({
  size,
  result,
}: {
  file: FileNodeInfoFragment;
  result: PnpExtractionResultFragment;
} & Pick<IconButtonProps, 'size'>) => {
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
    <Tooltip title={title}>
      <Badge badgeContent={badge} max={Infinity}>
        <IconButton color={color} size={size}>
          <Icon />
        </IconButton>
      </Badge>
    </Tooltip>
  );
};
