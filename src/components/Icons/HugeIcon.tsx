import {
  createStyles,
  SvgIconProps,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { cloneElement } from 'react';
import * as React from 'react';

const styles = ({ palette }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 64,
      height: 64,
      borderRadius: 64,
      backgroundColor: palette.grey[200],
    },
    icon: {
      color: palette.info.main,
    },
  });

export interface HugeIconProps extends WithStyles<typeof styles> {
  icon?: React.ComponentType<SvgIconProps>;
  children?: React.ReactElement<SvgIconProps>;
}

export const HugeIcon = withStyles(styles, {
  classNamePrefix: 'HugeIcon',
})(({ classes, icon: Icon, children }: HugeIconProps) => {
  const renderedIcon = Icon ? (
    <Icon fontSize="large" className={classes.icon} />
  ) : children ? (
    cloneElement(children, {
      fontSize: 'large',
      className: clsx(classes.icon, children.props.className),
    })
  ) : null;

  return <div className={classes.root}>{renderedIcon}</div>;
});
