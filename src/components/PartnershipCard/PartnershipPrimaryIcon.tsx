import { makeStyles, SvgIconProps, Tooltip } from '@material-ui/core';
import { Star } from '@material-ui/icons';
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
