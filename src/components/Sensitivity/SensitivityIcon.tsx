import { VerifiedUser } from '@mui/icons-material';
import { SvgIconProps, Theme, Tooltip } from '@mui/material';
import { Sensitivity as SensitivityType } from '~/api/schema.graphql';
import { extendSx } from '~/common';

const sensitivityStyles = {
  Low: (theme: Theme) => ({
    color: theme.palette.grey[400],
  }),
  Medium: (theme: Theme) => ({
    color: theme.palette.warning.main,
  }),
  High: (theme: Theme) => ({
    color: theme.palette.error.main,
  }),
};

export interface SensitivityIconProps extends SvgIconProps {
  value?: SensitivityType;
  loading?: boolean;
  disableTooltip?: boolean;
}

export const SensitivityIcon = ({
  value,
  loading,
  className,
  disableTooltip,
  sx,
  ...rest
}: SensitivityIconProps) => {
  return (
    <Tooltip title={!loading && !disableTooltip ? `${value} Sensitivity` : ''}>
      <VerifiedUser
        className={className}
        sx={[
          ...extendSx(sx),
          !loading && value ? sensitivityStyles[value] : {},
        ]}
        {...rest}
      />
    </Tooltip>
  );
};
