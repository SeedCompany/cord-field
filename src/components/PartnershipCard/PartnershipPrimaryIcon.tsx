import { Star } from '@mui/icons-material';
import { SvgIconProps, Tooltip } from '@mui/material';

export const PartnershipPrimaryIcon = ({
  className,
  ...rest
}: SvgIconProps) => {
  return (
    <Tooltip title="Primary">
      <Star
        className={className}
        {...rest}
        sx={{
          color: '#ffb400',
        }}
      />
    </Tooltip>
  );
};
