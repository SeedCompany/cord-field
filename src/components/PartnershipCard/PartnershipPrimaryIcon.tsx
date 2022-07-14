import { Star } from '@mui/icons-material';
import { makeStyles, SvgIconProps, Tooltip } from '@mui/material';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  primary: {
    color: '#ffb400',
  },
}));

export const PartnershipPrimaryIcon = ({
  className,
  ...rest
}: SvgIconProps) => {
  const classes = useStyles();

  return (
    <Tooltip title="Primary">
      <Star className={clsx(classes.primary, className)} {...rest} />
    </Tooltip>
  );
};
