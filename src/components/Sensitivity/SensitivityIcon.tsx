import { VerifiedUser } from '@mui/icons-material';
import { makeStyles, SvgIconProps, Tooltip } from '@mui/material';
import { grey } from '@mui/material/colors';
import clsx from 'clsx';
import { Sensitivity as SensitivityType } from '~/api/schema.graphql';

const useStyles = makeStyles(({ palette }) => ({
  Low: {
    color: grey[400],
  },
  Medium: {
    color: palette.warning.main,
  },
  High: {
    color: palette.error.main,
  },
}));

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
  ...rest
}: SensitivityIconProps) => {
  const classes = useStyles();

  return (
    <Tooltip title={!loading && !disableTooltip ? `${value} Sensitivity` : ''}>
      <VerifiedUser
        className={clsx(!loading && value ? classes[value] : null, className)}
        {...rest}
      />
    </Tooltip>
  );
};
