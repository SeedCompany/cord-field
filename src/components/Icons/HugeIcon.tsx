import { SvgIconProps } from '@mui/material';
import { cloneElement, isValidElement, ReactElement } from 'react';
import { extendSx } from '~/common';
import { Avatar, AvatarProps } from '../Avatar';

export interface HugeIconProps extends AvatarProps {
  icon?: React.ComponentType<SvgIconProps> | React.ReactElement<SvgIconProps>;
  children?: React.ReactElement<SvgIconProps>;
}

export const HugeIcon = ({ icon: Icon, children, ...rest }: HugeIconProps) => {
  const wrap = (el: ReactElement<SvgIconProps>) =>
    cloneElement(el, {
      fontSize: 'large',
    });
  const renderedIcon =
    Icon && !isValidElement(Icon) ? (
      <Icon fontSize="large" />
    ) : Icon ? (
      wrap(Icon)
    ) : children ? (
      wrap(children)
    ) : null;

  return (
    <Avatar
      {...rest}
      sx={[
        {
          width: 64,
          height: 64,
          color: 'info.main',
          backgroundColor: 'grey.200',
        },
        ...extendSx(rest.sx),
      ]}
    >
      {renderedIcon}
    </Avatar>
  );
};
