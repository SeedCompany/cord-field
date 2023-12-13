import { SvgIcon, SvgIconProps } from '@mui/material';

export const InactiveStatusIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 21 21">
    <path d="M19 13H5V11H19V13Z" />
    <circle cx="18.8" cy="11.8" r="1.8" />
    <circle cx="4.8" cy="11.8" r="1.8" />
  </SvgIcon>
);
