import {
  Button,
  ButtonGroup,
  ButtonProps,
  ClickAwayListener,
  Grow,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TooltipProps,
} from '@material-ui/core';
import * as React from 'react';
import { ReactNode } from 'react';
import { SecuredProp } from '../../api';
import { DataButton } from '../DataButton';

const useStyles = makeStyles(() => ({
  popover: {
    zIndex: 5,
  },
  iconButton: {
    maxWidth: 45,
  },
}));

export const SplitButton = <T extends any>({
  icon,
  options,
  ...props
}: ButtonProps & {
  icon: ReactNode;
  options: any[];
  loading?: boolean;
  secured?: SecuredProp<T>;
  redacted?: TooltipProps['title'];
  children: ((value: T) => ReactNode) | ReactNode;
  empty?: ReactNode;
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <ButtonGroup
        fullWidth
        variant="contained"
        ref={anchorRef}
        aria-label="split button"
      >
        <DataButton {...props} />
        <Button
          className={classes.iconButton}
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        >
          {icon}
        </Button>
        <Popper
          className={classes.popover}
          open={open}
          anchorEl={anchorRef.current}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem key={`split-button-item-${index}`}>
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </ButtonGroup>
    </>
  );
};
