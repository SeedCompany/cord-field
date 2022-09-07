import { VerifiedUser } from '@mui/icons-material';
import { SvgIconProps, Tooltip } from '@mui/material';
import { grey } from '@mui/material/colors';
import { makeStyles } from 'tss-react/mui';
import { Sensitivity as SensitivityType } from '~/api/schema.graphql';

const useStyles = makeStyles()(({ palette }) => ({
  // eslint-disable-next-line tss-unused-classes/unused-classes
  Low: {
    color: grey[400],
  },
  // eslint-disable-next-line tss-unused-classes/unused-classes
  Medium: {
    color: palette.warning.main,
  },
  // eslint-disable-next-line tss-unused-classes/unused-classes
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
  const { classes, cx } = useStyles();

  return (
    <Tooltip title={!loading && !disableTooltip ? `${value} Sensitivity` : ''}>
      <VerifiedUser
        className={cx(!loading && value ? classes[value] : null, className)}
        {...rest}
      />
    </Tooltip>
  );
};
