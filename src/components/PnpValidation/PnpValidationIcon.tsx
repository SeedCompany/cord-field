import { Check, Error, Warning } from '@mui/icons-material';
import { Badge, IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { groupToMapBy } from '@seedcompany/common';
import { PnpProblemSeverity as Severity } from '~/api/schema.graphql';
import { useNumberFormatter } from '../Formatters';
import { PnpProblemFragment as Problem } from './pnpExtractionResult.graphql';

export const PnPValidationIcon = ({
  problems,
  ...props
}: {
  problems: readonly Problem[];
} & IconButtonProps) => {
  const bySev = groupToMapBy(problems, (p) => p.severity);

  const formatNumber = useNumberFormatter();
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
        <IconButton color={color} {...props}>
          <Icon />
        </IconButton>
      </Badge>
    </Tooltip>
  );
};
