import { makeStyles, SvgIconProps } from '@material-ui/core';
import { cloneElement, isValidElement, ReactElement } from 'react';
import * as React from 'react';
import { Avatar, AvatarProps } from '../Avatar';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    width: 64,
    height: 64,
  },
  colorDefault: {
    color: palette.info.main,
    backgroundColor: palette.grey[200],
  },
}));

export interface HugeIconProps extends AvatarProps {
  icon?: React.ComponentType<SvgIconProps> | React.ReactElement<SvgIconProps>;
  children?: React.ReactElement<SvgIconProps>;
}

export const HugeIcon = ({ icon: Icon, children, ...rest }: HugeIconProps) => {
  const classes = useStyles();
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
    <Avatar {...rest} classes={{ ...classes, ...rest.classes }}>
      {renderedIcon}
    </Avatar>
  );
};
