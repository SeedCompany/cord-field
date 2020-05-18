import {
  createStyles,
  Divider,
  IconButton,
  DialogTitle as MuiDialogTitle,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { Cancel } from '@material-ui/icons';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 2, 2, 3),
    },
    title: {},
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const DialogTitle = withStyles(styles, {
  classNamePrefix: 'DialogTitle',
})((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <>
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h4" className={classes.title}>
          {children}
        </Typography>
        {onClose ? (
          <IconButton size="small" aria-label="close" onClick={onClose}>
            <Cancel />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
      <Divider />
    </>
  );
});
