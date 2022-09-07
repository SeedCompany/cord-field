import { Star } from '@mui/icons-material';
import { SvgIconProps, Tooltip } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
  primary: {
    color: '#ffb400',
  },
}));

export const PartnershipPrimaryIcon = ({
  className,
  ...rest
}: SvgIconProps) => {
  const { classes, cx } = useStyles();

  return (
    <Tooltip title="Primary">
      <Star className={cx(classes.primary, className)} {...rest} />
    </Tooltip>
  );
};
